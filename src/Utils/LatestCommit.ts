import Commit from '../Database/Models/Commit'

export = function getLatestCommit() {
  return Commit.findOne().sort("-buildNumber");
};