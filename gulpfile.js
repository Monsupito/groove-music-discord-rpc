/**
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
 */

const { src, dest } = require('gulp');
const coffee = require('gulp-coffee');
const obfuscator = require('gulp-javascript-obfuscator');
const prettier = require('gulp-prettier');
const nexe = require('nexe');
const path = require('path');
const fsextra = require('fs-extra');

// Just compile the CoffeeScript code
function compile(callback) {
    src('./src/*.coffee', { sourcemaps: false })
    // Compile the CoffeeScript code
    .pipe(coffee(/* This lines create errors {
        transpile: { 
            presets: [
                "@babel/env",
                {
                    targets: {
                        node: "current"
                    }
                }
            ] 
        }
    }*/))
    // Obfuscate the compiled code
    .pipe(obfuscator())
    // Beautify the code
    .pipe(prettier({ singleQuote: true }))
    // Write all in dist folder
    .pipe(dest('./dist'));

    // Copy OpenedFilesView in 'dist' folder
    fsextra.copy(path.join(__dirname, 'src', 'OpenedFilesView'), path.join(__dirname, 'dist', 'OpenedFilesView'));

    // Callback
    callback();
}

// Build a exe app
async function build(callback) {
    // Run compile task
    // Todo: Wait until this task is finished to build the executable,
    // so for the moment, use gulp compile first then gulp build
    /*
    await compile(function() {
        console.log('\n');
    });
    */

    // When compile task is finished, run nexe build
    nexe.compile({
        // Input bundle file path
        input: './index.js',
        // Output executable file path
        output: './dist/build/groove-rpc',
        // An object or string describing platform-arch-version
        target: 'windows',
        // Array of globs with files to include in the build
        resources: [
            './node_modules/**/*'
        ],
        // https://github.com/nexe/nexe/issues/780
        build: true,
        // Settings for patching the node.rc configuration file
        rc: {
            CompanyName: "FellGill",
            ProductName: "Groove Music RPC",
            FileDescription: "A NodeJS integration of Groove Music for Discord",
            FileVersion: "0,0,0,1",
            ProductVersion: "0,0,1",
            OriginalFilename: "groove-rpc.exe",
            InternalName: "groove-rpc",
            LegalCopyright: "Copyright FellGill. Apache 2.0 license."
        },
        // https://github.com/nexe/nexe/issues/782
        verbose: true,
        ico: './icon.ico'
    }).then(() => {
        // Copy OpenedFilesView in 'build' folder
        fsextra.copy(path.join(__dirname, 'src', 'OpenedFilesView'), path.join(__dirname, 'dist', 'build', 'OpenedFilesView'));

        callback();
    }, callback)
}

exports.default = compile
exports.compile = compile
exports.build = build