
const API_URL = 'https://gitnotify.com'
const API_PATH = '/typeahead/tz?offset=5.5'

function run() {
  console.log("did you know gitnotify is opensource? https://github.com/sairam/gitnotify/");

  var repoURI = window.location.pathname.substring(1);

  if (isTree(repoURI)) {
    var ns = document.querySelector('ul.pagehead-actions');
    var liElem = document.getElementById('gitnotify');

    if (ns && !liElem) {
      var htmlData = getHTML(getRepoInfoURI(repoURI), getTree(repoURI));
      ns.insertAdjacentHTML('beforeend', htmlData);
    }

    //  TODO: update the current gitnotify url to see if this is being tracked
    // check if user is logged in, if so, add to track
    // getAPIData(API_PATH, function (data) {
    //   if (data) {
    //     console.log(data)
    //   }
    // })

  }
}
function getPermalink(repoName, tree) {
  return API_URL + '?src=github&repo='+repoName+'&tree='+tree;
}

function getHTML(repoName, tree) {
  var href = getPermalink(repoName, tree)
  return '<li>&nbsp;&nbsp;&nbsp;<a target="_blank" rel="none" href="'+href+'"  class="btn btn-sm" id="gitnotify"' +
  ' aria-label="Get Notifications for this repository">'+
  'GitNotifyd</a><li>';
}

function isTree (uri) {
  var repoURI = uri.split('/');
  return repoURI.length === 2 || repoURI[2] === 'tree' || repoURI[2] === 'blob';
}

function getTree (uri) {
  var repoURI = uri.split('/');
  if (repoURI[2] === 'tree' || repoURI[2] === 'blob') {
    return repoURI[3];
  } else {
    return null;
  }
}


function getRepoInfoURI (uri) {
  var repoURI = uri.split('/')
  return repoURI[0] + '/' + repoURI[1]
}

function getAPIData (uri, callback) {
  var request = new Request(API_URL + uri, {
    headers: new Headers({
      'User-Agent': 'github/chrome-ext'
    })
  })

  fetch(request)
  .then(checkStatus)
  .then(parseJSON)
  .then(callback)
  .catch(e => console.error(e))
}

function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  throw Error(`Server returned a bad status: ${response.status}`)
}

function parseJSON (response) {
  if (response) {
    return response.json()
  }

  throw Error('Could not parse JSON')
}

run(); document.addEventListener('pjax:end', run, false)

// Code is Highly inspired from https://github.com/harshjv/github-repo-size/blob/master/src/inject.js
