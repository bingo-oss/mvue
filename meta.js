module.exports = {
  "helpers": {
    "if_or": function (v1, v2, options) {
      if (v1 || v2) {
        return options.fn(this);
      }

      return options.inverse(this);
    },
    "camelcase": str => {
      const capitalize = str => str.charAt(0).toUpperCase() + str.toLowerCase().slice(1)
      let string = str.toLowerCase().replace(/[^A-Za-z0-9]/g, ' ').split(' ')
                      .reduce((result, word) => result + capitalize(word.toLowerCase()))
      return string.charAt(0).toLowerCase() + string.slice(1)
    }
  },
  "prompts":{
    "name": {
      "type": "string",
      "required": true,
      "message": "项目名称"
    },
    "author": {
      "type": "string",
      "message": "作者"
    },
    "port": {
      "type": "number",
      "required": true,
      "message": "运行端口",
      "default": 9596
    },
    lint: {
      type: 'confirm',
      message: '是否开启ESLint(默认不开启)?',
      default:false
    },
    desktop: {
      type: 'confirm',
      message: '是否桌面应用(默认是普通web应用)?',
      default:false
    }
  },
  "filters": {
    '.eslintrc.js': 'lint',
    '.eslintignore': 'lint',
    '.vscode/*': 'lint',
    'nginx/*': '! desktop',
    'Dockerfile': '! desktop'
  },
  "completeMessage": "开始运行你的项目:\n\n  {{^inPlace}}cd {{destDirName}}\n  {{/inPlace}}npm install\n  npm run dev\n\n"
};
