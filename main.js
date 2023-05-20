import createComment from "./comment.js";

const fullCommentSection = document.querySelector('.section-comments');
const newCommentText = document.querySelector('.new-comment');
const sendBtn = document.querySelector('.btn-send');

let currentId = 0;

let currentUser;
let comments;
let localCommentSection;

// MODEL =============================

const getLocalComments = () => {
  const localComments = JSON.parse(localStorage.getItem('commentData'));
  return localComments;
}

const NewJsonComment = class {
  constructor(id, content, createdAt, currentUser) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
    this.score = 0;
    this.user = {
      image: {
        png: currentUser.image.png,
        webp: currentUser.image.webp
      },
      username: currentUser.username
    }
    this.replies = [];
  }
}

const createLocalComment = (comment) => {
  const localComments = getLocalComments();
  localComments.comments.push(comment);
  localStorage.setItem('commentData', JSON.stringify(localComments));
}

// VIEW =============================

const getCommentSection = async () => {
  const response = await fetch('./data.json');
  const commentSection = await response.json();
  localStorage.setItem('commentData', JSON.stringify(commentSection));
  currentUser = commentSection.currentUser;
  comments = commentSection.comments;
  comments.forEach(element => {
    fullCommentSection.appendChild(createComment(element, currentUser));
  });
}

if (localStorage.getItem('commentData')) {
  localCommentSection = getLocalComments();
  currentUser = localCommentSection.currentUser;
  comments = localCommentSection.comments;
  comments.forEach(element => {
    fullCommentSection.appendChild(createComment(element, currentUser));
  });
} else {
  getCommentSection();
}

// CONTROLLER =============================

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

sendBtn.addEventListener('click', () => {
  currentId = getCurrentId(comments) + 1;
  const content = newCommentText.value;
  const createdAt = 'Just now';
  const user = currentUser;
  const newComment = new NewJsonComment(currentId, content, createdAt, user);
  fullCommentSection.appendChild(createComment(newComment, currentUser));
  createLocalComment(newComment);
})


