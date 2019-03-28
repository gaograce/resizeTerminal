let colors = [
  {foreground: 'rgb(254,239,143)', background: 'rgb(22,102,47)'},
  {foreground: 'rgb(173, 173, 173)', background: 'rgb(32, 32, 32)'},
  {foreground: 'rgb(255, 255, 255)', background: 'rgb(255, 69, 0)'},
  {foreground: 'rgb(32, 32, 32)', background: 'rgb(173, 173, 173)'}
]
let index = 0
export default function (win, dialog) {
  index = 0
  let menuArr = [
    {
      label: 'Main',
      submenu: [
        {
          label: 'About',
          role: 'about'
        },
        {type: 'separator'},
        {label: 'Quit', role: 'quit'}
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' }
      ]
    },
    {
      label: 'Settings',
      submenu: [
        {
          label: 'Change Color',
          click: () => {
            if (win && !win.isDestroyed()) {
              win.webContents.send('toggleColor', colors[++index % colors.length])
            }
          }
        },
        {
          label: 'Restore',
          click: () => {
            if (win && !win.isDestroyed()) {
              index = 0
              win.webContents.send('toggleColor', colors[0])
            }
          }
        }
      ]
    }
  ]
  return menuArr
}
