const updateScoreData = (comments, id, scoreValue) => {
  for (let i = 0; i < comments.length; i++) {
    if (comments[i].id === id) {
      comments[i].score = scoreValue;
      break;
    }
    if (comments[i].replies) {
      const replies = comments[i].replies;
      if (replies.length > 0) {
        updateScoreData(replies, id, scoreValue);
      }
    }
  }
  return comments;
}

const deleteComment = (comments, id) => {
  for (let i = 0; i < comments.length; i++) {
    if (comments[i].id === id) {
      comments.splice(i, 1);
      break;
    }
    if (comments[i].replies) {
      const replies = comments[i].replies;
      if (replies.length > 0) {
        deleteComment(replies, id);
      }
    }
  }
  return comments;
}
const updateComment = (comments, id, commentBody) => {
  for (let i = 0; i < comments.length; i++) {
    if (comments[i].id === id) {
      comments[i].content = commentBody;
      break;
    }
    if (comments[i].replies) {
      const replies = comments[i].replies;
      if (replies.length > 0) {
        updateComment(replies, id, commentBody);
      }
    }
  }
  return comments;
}

const NewJsonReply = class {
  constructor(id, content, createdAt, currentUser, replyingTo) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
    this.score = 0;
    this.replyingTo = replyingTo;
    this.user = {
      image: {
        png: currentUser.image.png,
        webp: currentUser.image.webp
      },
      username: currentUser.username
    }
  }
}

const newLocalReply = (comments, reply, id) => {
  for (let i = 0; i < comments.length; i++) {
    if (comments[i].id === id) {
      comments[i].replies.push(reply);
      break;
    }
    if (comments[i].replies) {
      const replies = comments[i].replies;
      if (replies.length > 0) {
        for (let x = 0; x <= replies.length; x++) {
          if (replies[x].id === id) {
            replies.splice(x + 1, 0, reply);
            break;
          }
        }
      }
    }
  }
  return comments;
}

let currentId = 0;

const getCurrentId = (comments) => {  
  comments.forEach(element => {
    element.id > currentId
    ? currentId = element.id
    : currentId = currentId;
    if (element.replies && element.replies.length > 0) {
      const replies = element.replies
      getCurrentId(replies);
    }
  })
  return currentId;
}

const createComment = ((element, currentUser) => {
  const commentContainer = document.createElement('div');
  commentContainer.setAttribute('class', 'comment-container');
  commentContainer.setAttribute('id', `${element.id}`);

  const commentBox = document.createElement('article');
  commentBox.setAttribute('class', 'comment');

  commentContainer.appendChild(commentBox);

  const commentInfo = document.createElement('div');
  commentInfo.setAttribute('class', 'comment-info');

  const imageUser = document.createElement('img');
  imageUser.setAttribute('class', 'image-user');
  imageUser.setAttribute('src', `${element.user.image.png}`);
  imageUser.setAttribute('alt', `Image of user ${element.user.username}`);
  const userName = document.createElement('a');
  userName.setAttribute('class', 'user-name');
  userName.setAttribute('href', '#');
  userName.textContent = element.user.username;
  const datePosted = document.createElement('span');
  datePosted.setAttribute('class', 'date-posted');
  datePosted.textContent = element.createdAt;

  if (element.user.username === currentUser.username) {
    const idIndicator = document.createElement('span');
    idIndicator.setAttribute('class', 'id-indicator');
    idIndicator.textContent = 'you';
    commentInfo.append(imageUser, userName, idIndicator, datePosted)
  } else {
    commentInfo.append(imageUser, userName, datePosted);
  }

  commentBox.appendChild(commentInfo);

  const commentBody = document.createElement('p');
  commentBody.setAttribute('class', 'comment-body');

  if (element.replyingTo) {
    const replyTo = document.createElement('a');
    replyTo.setAttribute('class', 'reply-to');
    replyTo.textContent = `@${element.replyingTo} `;
    commentBody.append(replyTo, element.content);
  } else {
    commentBody.textContent = element.content;
  }

  commentBox.appendChild(commentBody);


  const commentScoreController = document.createElement('div');
  commentScoreController.setAttribute('class', 'comment-score-controller');

  const scoreUp = document.createElement('button');
  scoreUp.setAttribute('class', 'score-up');
  const score = document.createElement('span');
  score.setAttribute('class', 'score');
  score.textContent = element.score;
  let scoreValue = element.score
  const scoreDown = document.createElement('button');
  scoreDown.setAttribute('class', 'score-down');


  scoreUp.addEventListener('click', () => {
    scoreValue += 1;
    score.textContent = scoreValue;
    let commentData = JSON.parse(localStorage.getItem('commentData'));
    let comments = updateScoreData(commentData.comments, element.id, scoreValue);
    commentData.comments = comments;
    localStorage.setItem('commentData', JSON.stringify(commentData));
  })
  
  scoreDown.addEventListener('click', () => {
    if (scoreValue > 0) {
      scoreValue -= 1;
      score.textContent = scoreValue;
      let commentData = JSON.parse(localStorage.getItem('commentData'));
      let comments = updateScoreData(commentData.comments, element.id, scoreValue);
      commentData.comments = comments;
      localStorage.setItem('commentData', JSON.stringify(commentData));
    }
  })

  commentScoreController.append(scoreUp, score, scoreDown);

  commentBox.appendChild(commentScoreController);

  const commentControls = document.createElement('div');
  commentControls.setAttribute('class', 'comment-controls');
  
  if (element.user.username === currentUser.username) {
    const deleteIconButton = document.createElement('button');
    deleteIconButton.setAttribute('class', 'delete');
    const deleteIcon = document.createElement('img');
    deleteIcon.setAttribute('src', `images/icon-delete.svg`);
    deleteIcon.setAttribute('alt', 'Delete icon');
    deleteIconButton.append(deleteIcon, 'Delete');
    
    deleteIconButton.addEventListener('click', () => {
      const body = document.querySelector('body');
      const overlay = document.createElement('div');
      overlay.setAttribute('class', 'overlay');
      const confirmationBox = document.createElement('div');
      confirmationBox.setAttribute('class', 'confirmation-box');
      overlay.appendChild(confirmationBox);
      const headline = document.createElement('h1');
      headline.textContent = 'Delete comment';
      const paragraph = document.createElement('p');
      paragraph.innerHTML = 'Are you sure you want to delete this comment? This will remove the comment and can&apos;t be undone.';
      const confirmationControls = document.createElement('div');
      confirmationControls.setAttribute('class', 'confirmation-controls');
      const cancel = document.createElement('button');
      cancel.setAttribute('class', 'btn-cancel');
      cancel.textContent = 'No, cancel';
      const confirm = document.createElement('button');
      confirm.setAttribute('class', 'btn-confirm');
      confirm.textContent = 'Yes, delete';
      confirmationControls.append(cancel, confirm);
      confirmationBox.append(headline, paragraph, confirmationControls);
      body.appendChild(overlay);

      cancel.addEventListener('click', () => {
        overlay.remove();
      })

      confirm.addEventListener('click', () => {
        commentContainer.remove();
        let commentData = JSON.parse(localStorage.getItem('commentData'));
        let comments = deleteComment(commentData.comments, element.id);
        commentData.comments = comments;
        localStorage.setItem('commentData', JSON.stringify(commentData));
        overlay.remove();
      })

    })

    const editIconButton = document.createElement('button');
    editIconButton.setAttribute('class', 'edit');
    const editIcon = document.createElement('img');
    editIcon.setAttribute('src', `images/icon-edit.svg`);
    editIcon.setAttribute('alt', 'Edit icon');
    editIconButton.append(editIcon, 'Edit');

    commentControls.append(deleteIconButton, editIconButton);
    

    editIconButton.addEventListener('click', () => {
      const activeComment = document.createElement('textarea');
      activeComment.setAttribute('name', 'comment');
      activeComment.setAttribute('class', 'edit-comment');
      activeComment.setAttribute('cols', '30');
      activeComment.setAttribute('rows', '4');
      activeComment.value = commentBody.textContent;
      commentBody.remove();
      commentControls.before(activeComment);
      deleteIconButton.remove();
      editIconButton.remove();
      
      const updateBtn = document.createElement('button');
      updateBtn.setAttribute('class', 'btn-update');
      updateBtn.textContent = 'Update';
      commentControls.appendChild(updateBtn);

      activeComment.focus();

      updateBtn.addEventListener('click', () => {
        let newComment = activeComment.value;
        const userRegex = new RegExp(`@${element.replyingTo}\s?`, 'g');
        const filteredComment = newComment.replace(userRegex, '');
        const replyTo = document.createElement('a');
        replyTo.setAttribute('class', 'reply-to');
        replyTo.textContent = `@${element.replyingTo} `;
        commentBody.innerHTML = '';
        commentBody.append(replyTo, filteredComment);
        let commentData = JSON.parse(localStorage.getItem('commentData'));
        let comments = updateComment(commentData.comments, element.id, filteredComment);
        commentData.comments = comments;
        localStorage.setItem('commentData', JSON.stringify(commentData));
        commentControls.before(commentBody);
        activeComment.remove();
        updateBtn.remove();
        commentControls.append(deleteIconButton, editIconButton);
      })
    })

  } else {
    const replyIconButton = document.createElement('button');
    replyIconButton.setAttribute('class', 'reply');
    const replyIcon = document.createElement('img');
    replyIcon.setAttribute('src', 'images/icon-reply.svg');
    replyIcon.setAttribute('alt', 'Reply icon')
    replyIconButton.append(replyIcon, 'Reply');
  
    commentControls.append(replyIconButton);

    replyIconButton.addEventListener('click', () => {
      let commentData = JSON.parse(localStorage.getItem('commentData'));
      const currentId = getCurrentId(commentData.comments) + 1;

      const newReply = document.createElement('div');
      newReply.setAttribute('class', 'section-new-comment');
      const newReplyBody = document.createElement('textarea');
      newReplyBody.setAttribute('name', 'comment');
      newReplyBody.setAttribute('class', 'new-comment');
      newReplyBody.setAttribute('cols', '30');
      newReplyBody.setAttribute('rows', '4');
      newReplyBody.setAttribute('placeholder', 'Add a reply');
      const imageUser = document.createElement('img');
      imageUser.setAttribute('class', 'image-user');
      imageUser.setAttribute('src', `${currentUser.image.png}`);
      imageUser.setAttribute('alt', `Image of user ${currentUser.username}`);
      const replyBtn = document.createElement('button');
      replyBtn.setAttribute('class', 'btn-send');
      replyBtn.textContent = 'Reply'; 
      newReply.append(newReplyBody, imageUser, replyBtn);

      if (commentContainer.querySelector('.replies-container')) {
        const repliesContainer = document.querySelector('.replies-container');
        const replies = repliesContainer.querySelector('.replies');
        replies.appendChild(newReply);
        newReplyBody.focus();
        replyBtn.addEventListener('click', () => {
          const reply = new NewJsonReply(currentId, newReplyBody.value, 'Just now', currentUser, element.user.username);
          newReply.remove();
          replies.appendChild(createComment(reply, currentUser));
          let commentData = JSON.parse(localStorage.getItem('commentData'));
          const comments = newLocalReply(commentData.comments, reply, element.id)
          commentData.comments = comments;
          localStorage.setItem('commentData', JSON.stringify(commentData));
        })
      } else {
        commentContainer.appendChild(newReply);
        newReplyBody.focus();
        replyBtn.addEventListener('click', () => {
          const reply = new NewJsonReply(currentId, newReplyBody.value, 'Just now', currentUser, element.user.username);
          newReply.remove();
          commentContainer.appendChild(createComment(reply, currentUser));
          let commentData = JSON.parse(localStorage.getItem('commentData'));
          const comments = newLocalReply(commentData.comments, reply, element.id)
          commentData.comments = comments;
          localStorage.setItem('commentData', JSON.stringify(commentData));
        })
      }
      
    })
  }


  commentBox.appendChild(commentControls);


  if (element.replies) {
    const replies = element.replies;
    if (replies.length > 0) {
      const repliesContainer = document.createElement('div');
      repliesContainer.setAttribute('class', 'replies-container');
      
      const replyParentLine = document.createElement('div');
      replyParentLine.setAttribute('class', 'reply-parent-line');

      repliesContainer.appendChild(replyParentLine);

      const repliesCollection = document.createElement('div');
      repliesCollection.setAttribute('class', 'replies');

      replies.forEach(element => {
        repliesCollection.appendChild(createComment(element, currentUser));
      });

      repliesContainer.appendChild(repliesCollection);

      commentContainer.appendChild(repliesContainer)
      return commentContainer;
    } else {
      return commentContainer;
    }
  } else {
    return commentContainer;
  }
  
})



export default createComment;