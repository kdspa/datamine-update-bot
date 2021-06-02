import axios from 'axios';
import * as Commit from '../Database/Models/Commit';
import sendSingleComment from '../Utils/SendComment';
import * as Bot from '../Main'
import * as config from '../../config.json'

function parseBuildNumber(title: string) {
  const regex = /(Canary\sbuild:\s([0-9]*))/;
  return regex.exec(title)[2];
}

const RequestOptions = {
  auth: {
    username: config.auth.username,
    password: config.auth.password,
  },
};

async function getCommitsWithComments() {
  const { data } = await axios.get(
    "https://api.github.com/repos/Discord-Datamining/Discord-Datamining/commits",
    RequestOptions
  );

  return data
    .filter((commit) => commit.commit.comment_count >= 1)
    .map((commit) => {
      return {
        ...commit,
        commit: {
          ...commit.commit,
          buildNumber: parseBuildNumber(commit.commit.message),
        },
      };
    })
    .sort((a, b) => a.commit.buildNumber - b.commit.buildNumber);
}

function parseImagesFromComment(comment) {
  const images = [];
  const markdownImageRegexs = [
    /!\[.*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/gm,
    /!\[.*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/m,
  ];
  const markdownImages = comment.body.match(markdownImageRegexs[0]);
  const htmlImageRegexs = [
    /<img\s+[^>]*src="([^"]*)"[^>]*>/gm,
    /<img\s+[^>]*src="([^"]*)"[^>]*>/m,
  ];
  const htmlImages = comment.body.match(htmlImageRegexs[0]);
  if (Array.isArray(markdownImages)) {
    images.push(
      ...markdownImages.map((image) => ({
        old: image as string,
        new: markdownImageRegexs[1].exec(image)[1] as string,
      }))
    );
  }
  if (Array.isArray(htmlImages)) {
    images.push(
      ...htmlImages.map((image) => ({
        old: image as string,
        new: htmlImageRegexs[1].exec(image)[1] as string,
      }))
    );
  }
  return images;
}

async function getCommentsWithImagesOfCommit(commit) {
  const { data } = await axios.get(commit.comments_url, RequestOptions);
  // console.log("in map", commit.commit.buildNumber);
  const comments = data.map((comment) => {
    const images = parseImagesFromComment(comment);
    if (images.length >= 1) {
      images.forEach((image) => {
        comment.body = comment.body.replace(image.old, "");
      });
    }
    return {
      ...comment,
      images,
    };
  });
  return [commit.commit, comments];
}

function transformCommentDataShape(comment, { title, buildNumber }) {
  return {
    _id: comment.id,
    id: comment.id,
    title,
    buildNumber,
    timestamp: comment.created_at,
    url: comment.html_url,
    description: comment.body,
    user: {
      username: comment.user.login,
      id: comment.user.id,
      avatarURL: comment.user.avatar_url,
      url: comment.user.html_url,
    },
    images: comment.images.map((image) => image.new),
  };
}

export = async function commitHandler() {
  const commits = await getCommitsWithComments();
  const commitsWithComments = await Promise.all(
    commits.map(getCommentsWithImagesOfCommit)
  );
  commitsWithComments.forEach(async ([commit, comments]: any) => {
    const [firstComment, ...subComments] = comments.map((comment) =>
      transformCommentDataShape(comment, {
        title: commit.message,
        buildNumber: commit.buildNumber,
      })
    );
    const foundCommit = await Commit.findById(firstComment.id);
    if (!foundCommit) {
      console.log("Needs to store:", commit.buildNumber);
      try {
        const doc = await Commit.create({
          ...firstComment,
          comments: subComments,
        });
        console.log(`Stored Commit ${doc._id} for Build ${doc.buildNumber}`);
        await sendSingleComment(Bot, doc);
      } catch (error) {
        console.error(
          `Error storing commit (${firstComment._id}) for build ${commit.buildNumber}`,
          error.stack
        );
      }
    } else {
      subComments.forEach(async (comment) => {
        if (foundCommit._id === comment.id) return;
        if (foundCommit.comments.find((c) => c.id === comment.id)) return;
        try {
          await Commit.updateOne(
            { _id: foundCommit._id },
            { $push: { comments: comment } }
          );
          console.log(
            `Stored comment ${comment.id} for Commit ${foundCommit._id}`
          );
          await sendSingleComment({
            _id: foundCommit._id,
            title: foundCommit.title,
            ...comment,
          });
        } catch (error) {
        //  console.error(
        //    `Error storing comment (${command.id}) commit (${foundCommit._id}) for build ${foundCommit.buildNumber}`,
        //    error.stack
        //  );
        }
      });
    }
  });
};