// implement your posts router here
const router = require('express').Router()
const Post = require('./posts-model')

// TEST: http get :9000/api/posts
router.get('/', async (req, res)=>{
    // res.json({message: "TEST: get /api/posts !"})
    Post.find()
        .then( posts =>{
            // console.log(posts)
            res.status(200).json(posts)
        } )
        .catch(err=>{
            res.status(500).json({
                message: "The posts information could not be retrieved",
                err: err.message,
                stack: err.stack
            })
        })
})

// TEST: http get :9000/api/posts/1
router.get('/:id', async (req, res)=>{
    // res.json({message: "TEST: get /api/posts/:id !"})
    Post.findById(req.params.id)
        .then( post=>{
            if(!post){
             res.status(404).json({message:  "The post with the specified ID does not exist"})   
            }else{
                res.status(200).json(post)
            }
        } )
        .catch(err=>{
            res.status(500).json({
                message: "The posts information could not be retrieved",
                err: err.message,
                stack: err.stack
            })
        })
})

// TEST: http post :9000/api/posts title=aaa contents=bbb
router.post('/', async (req, res)=>{
    // res.json({message: "TEST: post /api/posts !"})
    const {title, contents} = req.body
    if(!title | !contents){
        res.status(400).json({message: "Please provide title and contents for the post" })
    }else{
        Post.insert(req.body)
            .then( postId=>{
                // console.log(postId)
                Post.findById(postId.id)
                .then( post =>{
                    // console.log(post)
                    res.status(201).json(post)
                })
            })
            .catch(err=>{
                res.status(500).json({
                    message: "The posts information could not be retrieved",
                    err: err.message,
                    stack: err.message
                })
            })
    }
})

// TEST: http delete :9000/api/posts/1
router.delete('/:id', async (req, res)=>{
    // res.json({message: "TEST: delete /api/posts/:id !"})
    Post.findById(req.params.id)
        .then( post =>{
            if(!post){
                res.status(404).json({message: "The post with the specified ID does not exist"})
            }else{
                Post.remove(req.params.id)
                    .then( result=>{
                        res.status(200).json(post)
                    })
                    .catch(err=>{
                        res.status(500).json({
                            message: "The posts information could not be retrieved",
                            err: err.message,
                            stack: err.message
                        }) 
                    })
            }
        })
})

// TEST: http put :9000/api/posts/1
router.put('/:id', async (req, res)=>{
    // res.json({message: "TEST: put /api/posts/:id !"})
    // Post.findById(req.params.id)
    //     .then( findPost=>{
    //         if(!findPost){
    //             res.status(404).json({message: "The post with the specified ID does not exist" })
    //         }else if(!req.body.title || !req.body.contents){
    //             res.status(400).json({message: "Please provide title and contents for the post" })
    //         }else{
    //             Post.update(req.params.id, req.body)
    //                 .then( post =>{
    //                     Post.findById(post.id)
    //                         .then( newPost => {
    //                             res.status(200).json(newPost)
    //                         })
    //                 })
    //                 .catch(err=>{
    //                     res.status(500).json({
    //                         message: "The posts information could not be retrieved",
    //                         err: err.message,
    //                         stack: err.message
    //                     }) 
    //                 })
    //         }
    //     })
    //     .catch()
    try{
       const findPost =await Post.findById(req.params.id)
       if(!findPost){
            res.status(404).json({message: "The post with the specified ID does not exist" }) 
       } else if (!req.body.title || !req.body.contents){
            res.status(400).json({message: "Please provide title and contents for the post" })
       } else {
            const updatePost =await Post.update(req.params.id, req.body)
            const newPost =await Post.findById(req.params.id)
            res.status(200).json(newPost) 
       }

    }catch(err){
        res.status(500).json({
            message: "The posts information could not be retrieved",
            err: err.message,
            stack: err.message
        })  
    }
})

// TEST: http get :9000/api/posts/1/comments
router.get('/:id/comments', async (req, res)=>{
    // res.json({message: "TEST: get /api/posts/:id/comments !"})
    Post.findById(req.params.id)
        .then( findPost =>{
            if(!findPost){
                res.status(404).json({message: "The post with the specified ID does not exist"})
            } else {
                Post.findPostComments(req.params.id)
                    .then( commit =>{
                        res.status(200).json(commit)
                    })
                    .catch(err=>{
                        res.status(500).json({
                            message: "The posts information could not be retrieved",
                            err: err.message,
                            stack: err.message
                        })   
                    })
            }
        })
})



module.exports = router