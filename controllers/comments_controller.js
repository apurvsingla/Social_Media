const Comment = require('../models/comments');
const Post = require('../models/post');


module.exports.create = async function(req, res) {
    try {
        let post = await Post.findById(req.body.post);
        if (post) {
            let comment = await Comment.create({
                    content: req.body.content,
                    post: req.body.post,
                    user: req.user._id
                })
                // handle error
            post.comments.push(comment);
            post.save();
            if (req.xhr) {
                // Similar for comments to fetch the user's id!
                comment = await comment.populate('user', 'name').execPopulate();

                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }


            req.flash('success', 'Comment published!');
            res.redirect('/');
        }
    } catch (error) {
        console.log('Error', err);
        return;
    }
}

//keeping this normal for remembring
module.exports.destroy = function(req, res) {
    Comment.findById(req.params.id, function(err, comment) {
        // .id means converting the object id into string
        if (comment.user == req.user.id) {
            let postId = comment.post;
            comment.remove();
            Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } }, function(err, post) {
                return res.redirect('back');
            })
        } else {
            return res.redirect('back');
        }
    })
}