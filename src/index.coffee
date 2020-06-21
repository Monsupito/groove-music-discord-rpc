###*
 * Copyright 2020 FellGill
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ###

{ Client } = require 'discord-rpc'
Chalk = require 'chalk'
ChildProcess = require 'child_process'
LogUpdate = require 'log-update'
{ sleep } = require 'sleep'
Tasklist = require 'tasklist'
Path = require 'path'
FS = require 'fs'

###*
# New RPC client
RPC = new Client(transport: 'websocket')

# Log the RPC client with ID
RPCID = '723124528590618664'
RPCScopes = ['rpc']

RPC.login
  RPCID: RPCID # Client ID
  RPCScopes: RPCScopes # Client scopes
###

# Say this before looping code
console.log "You using #{Chalk.yellow 'groove-music-discord-rpc'} by #{Chalk.yellow 'FellGill'}\n"

# Create a log for overwriting the previous output in the terminal
log = LogUpdate.create(process.stdout, showCursor: true)

# Test if Groove Music is open
# TODO: Test if Groove play music
grooveIsOpen = () ->
  new Promise((resolve, reject) ->
    ChildProcess.exec 'tasklist', (error, stdout, stderr) ->
      if stderr
        return console.log error

      resolve(stdout.toLowerCase().indexOf('Music.UI'.toLowerCase()) > -1)
  )

# Main code
program = () ->
  # If Groove Music is open
  if await grooveIsOpen()
    # Launch OpenedFilesView to view all files connected to Groove
    # TODO: FIX THIS !!!!!!!!!!!!!!!!!
    Process = ChildProcess.exec "#{Path.join(__dirname, 'OpenedFilesView', 'OpenedFilesView.exe')} /processfilter Music.UI.exe /sxml files.xml"

    Process.on 'exit', (code) ->
      log "#{Chalk.red 'files.csv'} is regenerated."

  # If Groove Music is not open
  else
    log 'Groove Music is not open'
    # Clear Discord activity
    # RPC.clearActivity()

  # You have to wait 15 seconds or more, simply because
  # the program does so much calculation and requests
  # that it can crash the computer
  sleep 15
  program()

# Start the loop
program()