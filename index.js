exports.handler = async (event) => {
    return require('./posts')();
}

exports.handler(null)
    .then(next => {})