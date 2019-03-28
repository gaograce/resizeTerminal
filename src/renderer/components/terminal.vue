<template>
    <div ref="main" style="overflow: auto;width:100%;height:100%;position: relative" class="scroll-control">
        <resize-observer @notify="handleResize" />
        <div ref="terminal" :style="{width: width, height: height}"></div>
    </div>
</template>
<script>
  import { Terminal } from 'xterm'
  import os from 'os'
  import 'xterm/dist/xterm.css'
  import * as fit from 'xterm/lib/addons/fit/fit'
  import * as attach from 'xterm/lib/addons/attach/attach'
  import {ipcRenderer} from 'electron'
  const pty = require('node-pty')
  Terminal.applyAddon(fit)
  Terminal.applyAddon(attach)
  export default {
    name: 'terminal',
    props: {
    },
    data () {
      return {
        xterm: null,
        ptyProcess: null,
        rows: 20,
        cols: 120,
        cwd: os.homedir(),
        isInit: false,
        foreground: 'rgb(254,239,143)',
        background: 'rgb(22,102,47)'
      }
    },
    computed: {
      width () {
        return this.cols * 9 + 20 + 'px'
      },
      height () {
        return this.rows * 17 + 'px'
      }
    },
    methods: {
      handleResize () {
        this.$nextTick(() => {
          let rect = this.$refs.main.getBoundingClientRect()
          console.log(rect.width, rect.height, 'resize')
          this.resizeBySize(rect.width < 200 ? 200 : rect.width, rect.height)
        })
      },
      reinit (options = {}) {
        if (this.xterm || this.ptyProcess) {
          this.xterm.destroy()
          this.ptyProcess.destroy()
          this.xterm = null
          this.ptyProcess = null
        }
        this.cwd = options.cwd || this.cwd
        this.rows = options.rows || this.rows
        this.cols = options.cols || this.cols
        this.init()
      },
      init () {
        // 判断terminal是否显示，没有显示的话，不做初始化操作（没有显示初始化会卡死）
        if (this.$refs.main.offsetParent === null) return
        if (!this.xterm || !this.ptyProcess) {
          this.isInit = true
          const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL']
          let env = process.env
          env['LC_ALL'] = 'zh_CN.UTF-8'
          env['LANG'] = 'zh_CN.UTF-8'
          env['LC_CTYPE'] = 'zh_CN.UTF-8'
          this.ptyProcess = pty.spawn(shell, [], {
            name: 'xterm-color',
            cols: this.cols,
            rows: this.rows,
            cwd: this.cwd,
            env: env,
            encoding: 'utf8'
          })
          this.xterm = new Terminal({
            cols: this.cols,
            rows: this.rows,
            theme: {
              foreground: this.foreground,
              background: this.background,
              cursor: this.foreground
            },
            cursorBlink: 5
          })
          this.xterm.open(this.$refs.terminal)
          this.xterm.fit()
          this.xterm.on('data', (data) => {
            console.log('xterm:', JSON.stringify(data))
            this.ptyProcess.write(data)
          })
          this.ptyProcess.on('data', (data) => {
            console.log('ptyProcess:', JSON.stringify(data), typeof data)
            this.xterm.write(data)
          })
        }
      },
      execute (cmd) {
        this.ptyProcess.write(cmd + '\n')
      },
      resize (cols, rows) {
        this.cols = cols
        this.rows = rows
        this.xterm.resize(cols, rows)
        this.ptyProcess.resize(cols, rows)
      },
      resizeBySize (width, height) {
        let cols = Math.floor((width - 20) / 9)
        let rows = Math.floor(height / 17)
        this.resize(cols, rows)
      },
      resizeHeight (height) {
        let rows = Math.floor(height / 17)
        this.resize(this.cols, rows)
      }
    },
    created () {
      ipcRenderer.on('toggleColor', (event, data) => {
        this.foreground = data.foreground
        this.background = data.background
        this.reinit()
      })
    },
    mounted () {
      this.init()
    }
  }
</script>
<style>
    .xterm .xterm-viewport{
        overflow: hidden;
    }
</style>
