const path = require('path')
const { spawn } = require('child_process')

const fileForm = document.querySelector('#fileForm')
const sourceFile = document.querySelector('#sourceFile')
const download = document.querySelector('#download')
const progress = document.querySelector('#progress .progress-bar')

fileForm.onsubmit = (e) => {
  e.preventDefault()

  download.classList.add('disabled')

  const file = sourceFile.files[0]

  const childProcessProbe = spawn(
    path.join(__dirname + '/lib/ffmpeg/bin/ffprobe'),
    ['-count_frames', file.path]
  )

  progress.classList.add('progress-bar-animated')
  progress.innerHTML = 'Processing...'


  childProcessProbe.stdout.on('data', (output) => {
    console.log(output.toString())
  })

  childProcessProbe.stderr.on('data', (output) => {
    console.log(output.toString())
  })

  const childProcessFF = spawn(
    path.join(__dirname + '/lib/ffmpeg/bin/ffmpeg'),
    ['-y', '-i', file.path, path.join(__dirname + '/out/out.mkv')]
  )

  childProcessFF.stdout.on('data', (output) => {
    console.log(output.toString())
  })

  childProcessFF.stderr.on('data', (data) => {
    console.log(data.toString());
  });

  childProcessFF.on('exit', (code) => {
    if (code === 0) {
      download.classList.remove('disabled')
      progress.classList.remove('progress-bar-animated')
      progress.innerHTML = ''
    }
  });
}