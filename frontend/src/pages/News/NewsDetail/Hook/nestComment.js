export const nestComments = (comments) => {
    const map = {};
    const roots = [];
  
    comments.forEach((comment) => {
      map[comment.id] = { ...comment, replies: [] };
    });
  
    comments.forEach((comment) => {
      if (comment.parentId) {
        map[comment.parentId]?.replies.push(map[comment.id]);
      } else {
        roots.push(map[comment.id]);
      }
    });
  
    return roots;
  };
  