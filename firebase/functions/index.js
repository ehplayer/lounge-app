/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for t`he specific language governing permissions and
 * limitations under the License.
 */
'use strict';


// [START import]
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firestore);
const gcs = require('@google-cloud/storage')();
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');
const fetch = require('node-fetch')
const utils = {};
// [END import]

// [START generateThumbnail]
/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 */
// [START generateThumbnailTrigger]
exports.generateThumbnail = functions.storage.object().onFinalize((object) => {
// [END generateThumbnailTrigger]
  // [START eventAttributes]
  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.
  const contentType = object.contentType; // File content type.
  const resourceState = object.resourceState; // The resourceState is 'exists' or 'not_exists' (for file/folder deletions).
  const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.
  // [END eventAttributes]

  // [START stopConditions]
  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    console.log('This is not an image. contentType:' + contentType);
    return null;
  }

  // Get the file name.
  const fileName = path.basename(filePath);
  // Exit if the image is already a thumbnail.
  if (fileName.startsWith('thumb_')) {
    console.log('Already a Thumbnail. fileName: ' + fileName);
    return null;
  }
  // [END stopConditions]

  // [START thumbnailGeneration]
  // Download file from bucket.
  const bucket = gcs.bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);
  const metadata = {
    contentType: contentType,
  };
  return bucket.file(filePath).download({
    destination: tempFilePath,
  }).then(() => {
    console.log('Image downloaded locally to', tempFilePath);
    // Generate a thumbnail using ImageMagick.
    return spawn('convert', [tempFilePath, '-thumbnail', '200x200>', tempFilePath]);
  }).then(() => {
    console.log('Thumbnail created at', tempFilePath);
    // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
    const thumbFileName = `thumb_${fileName}`;
    const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
    // Uploading the thumbnail.
    return bucket.upload(tempFilePath, {
      destination: thumbFilePath,
      metadata: metadata,
    });
    // Once the thumbnail has been uploaded delete the local file to free up disk space.
  }).then(() => fs.unlinkSync(tempFilePath));
  // [END thumbnailGeneration]
});
// [END generateThumbnail]

exports.sendPushNotification = functions.firestore
    .document('{sectionId}/{boardId}/notice/{noticeId}')
    .onCreate((snap, context) => {
    const {sectionId, boardId} = context.params;
    // 1. 새로 생성된 게시글 획득
    const noticeDocument = snap.data();

    console.log("on create " + noticeDocument.title)
    // 2. total 게시판일 경우 해당 대학 전체 push
    if(boardId === 'total'){
        const universe = sectionId.replace('univ', '');
        return admin.firestore().collection('users').where('universe', '==', universe)
            .get().then(memberDoc => {
            return memberDoc.docs.forEach(memberData => {
                const member = memberData.data();
                console.log("push send to " + member.name)
                return fetch('https://exp.host/--/api/v2/push/send', {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "to": member.pushToken,
                        "title": noticeDocument.title,
                        "body":noticeDocument.content
                    })
                })
            })
        }).catch(e => console.log(e))
    }
    // 3. 게시판 정보 획득 후 push 전송
    const boardRef = admin.firestore().collection(sectionId).doc(boardId);
    return boardRef.get().then(doc => {
        const data = doc.data();
        const pushTargetList = data.authMemberList ? data.staffMemberList.concat(data.authMemberList) : data.staffMemberList
        return pushTargetList.forEach(member => {
            admin.firestore().collection('users').doc(member.docId)
                .get().then(memberDoc => {
                const memberData = memberDoc.data();
                console.log("board push send to " + member.name)
                return fetch('https://exp.host/--/api/v2/push/send', {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "to": memberData.pushToken,
                        "title": noticeDocument.title,
                        "body":noticeDocument.content
                    })
                })
            }).catch(e => console.log(e))
        });
    })
    .catch(e => console.log(e))

})