
function run() { console.log("extension works!") }

run()

document.addEventListener('pjax:end', run, false)
