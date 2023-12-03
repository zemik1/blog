import PostModel from "../models/Post.js";


export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate({path: "user", select: ["name", "avatar"]})
        res.json(posts)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Не удалость получить статьи"
        })
    }
}
export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: {viewsCount: 1},
            },
            {
                returnDocument: "after",
            }
        ).then((doc, err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Failed to return the post",
                });
            }
            if (!doc) {
                return res.status(404).json({
                    message: "Post not found",
                });
            }
            res.json(doc);
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error",
        });
    }
};
export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findOneAndDelete({
            _id: postId,
        }).then((err, doc) => {
            if (err) {
                console.log(err)
                return res.status(400).json({
                    message: "Не удалость удалить статью"
                })
            }
            if (!doc) {
                return res.status(400).json({
                    message: "Страница была уже удалена"
                })
            }
            res.json({
                success: true,
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error",
        });
    }
}
export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId
        })
        const post = await doc.save()

        res.json(post)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось создать пост'
        })
    }
}
export const update = async (req, res) => {
    try {
        const postId = req.params.id
        await PostModel.updateOne({
            _id: postId
        }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.userId,
            tags: req.body.tags,
        })
        res.json({
            success: true
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Не удалость обновить пост"
        })
    }
}