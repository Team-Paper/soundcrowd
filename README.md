# SoundCrowd

_A real-time collaborative music production and social platform._

Remote musical collaboration is hard. You often have to record clips, send them back and forth, and somehow piece them all together. We built SoundCrowd to solve that problem. Now, you can connect with your Facebook friends, remotely collaborate, and share the songs you’ve made, all using our in-browser, real-time digital audio workstation.

## Our Team

Built by [Amelia Gutfeldt](https://github.com/weblemur), [Greg Hanley](https://github.com/ghanley), [Tess Monical](https://github.com/omnomnomtea), and [Chris Skene](https://github.com/christophersk) as a capstone project at Fullstack Academy of Code.

## Awards

Winner of the October 2017 Fullstack Demo Day Developer's Choice award.

## Technical Challenges

The major challenges of this application revolved around synchronization at different scales. From syncing the playback of different sounds, to synchronization of state between users, making sure everything worked together as intended was complex.

One of the first critical issues we had was synchronizing the timing of different sound elements. Every sound file had to be passed through our full effects loop and played back at a coordinated and precise time. Because of this we only had millisecond margins of error when building our digital audio workstation, which means performance was key. To solve this issue, we repeatedly sampled the audioContext clock, which exposes access to the underlying audio subsystem's hardware clock. Based on the current value of the audioContext clock, we were able to determine which clips needed to be played at that point in time.

Another pivotal challenge was creating and implementing a rich and responsive UI. Dragging and dropping clips within the timeline proved to be complex. We used React-draggable for some of the drag-and-drop functionality, but this alone was not powerful enough to do everything we needed. In some cases, we had to manually manage event listeners in order to get the correct behavior from dragging and dropping Specifically, if you look in `client/DAW/components/file-item.js` and `client/DAW/project-store/reducers/dragging/`, you will see that dragging between components was complex and required us to carefully manage both state and event listeners.

Once audio and visual interface were both working, we had to link the interactive visual layout with our precise audio playback so that the visual display accurately reflected the state of the audio and controlled playback. Perfecting this was important––when it works well, it feels seamless and invisible, but even slight problems could make it clunky and frustrating to use. We were able to keep everything in sync by using Firebase as our source of truth for this application. Each update to the redux store also updates Firebase, and when Firebase updates, the store is subscribed to these updates- which allows us to sync our store with both local changes and also changes from another user or computer.


## Tech Stack

- Web Audio API for the underlying foundation of playback and editing, as well as for making SVG waveforms.
- MediaStream Recording API for recording and mixdown
- Firebase to handle the real time collaboration
- AWS S3 and CloudFront to host and and quickly serve the sound files.
- NodeJs, ExpressJS, and Postgres on the back end
- React and Redux for general client-side state and component management


## Usage/Installation/Deployment

This assumes familiarity with and installation of Node (version 7.0.0 or above) and PostgreSQL. In addition, to get this project working locally you will need to set up an account with AWS, Google, Facebook, and Firebase and set the appropriate environment variables.

Environment Variables Needed: `GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK, FIREBASE_API_KEY, FIREBASE_MESSAGING_SENDER_ID, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, FACEBOOK_CALLBACK, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY`

### Steps to install, run, and deploy:

1. Clone the repo
2. `npm install`
3. set environment variables to appropriate values (perhaps by creating a file secrets.js that sets them, if installing locally)
4. Use the appropriate npm script (see package.json)
  - `npm run start-dev` for development mode
  - `npm run build` or `npm run build-watch` to build but not run (build-watch will watch for changes)
  - `npm run start` to start (but will not build using webpack)
  - `npm run test` to run all tests
  - `npm run deploy` to deploy to Heroku. You will need to have an account set up on Heroku before running this script.

## Project Structure

All client-side logic is in the folder "client" and server-side logic in "server".

The structure of the server folder is fairly straightforward with routing in "/server/api", authorization logic in "/server/auth" and database logic in "/server/db".

Client-side structuring is a bit more complex. The folder "/server/client/DAW" contains logic related to the Digital Audio Workstation, including a separate redux store and a folder of components. The logic of the rest of the front-end is in "/client/store" and "/client/components".

Test files are saved alongside the files they test, where `filename.spec.js` tests `filename.js`.

## Acknowledgments

Boilerplate code from [Fullstack Boilermaker](https://github.com/FullstackAcademy/boilermaker)
