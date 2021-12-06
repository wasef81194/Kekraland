const express = require('express');
const router = express.Router();

const db = require('../../config/database');
const {Albums, Tracklists} = require('../models');

router.get('/', (req, res) => {
    Albums.findAll({
        include: [{
            model: Tracklists,
            where:{
                id:Tracklists.AlbumId
            }
        }]
    }).then(albums => {
        if(albums){
            res.send(albums)
        }else{
            res.sendStatus(403)
        }
    });
});

router.get('/destroy', (req, res) => { 
  Albums.destroy()
  .then(albums => {
    res.send(albums);
    res.sendStatus(200).json(albums);
  })
  .catch(err => console.log(err))
});

router.get('/byname/:name', async (req,res)=>{
    const album=await Albums.findOne({
        where:{
            nom:req.params.name
        }
    })
    const tracklist=await Tracklists.findAll({
        where:{
            ProduitId:album.ProduitId
        }
    })

    if(album){
        console.log(album)
        res.json({
            album,
            tracklist
        })
    }else{
        res.sendStatus(404)
    }
})

router.post('/create', (req, res) => {
    console.log(req.body);
    Albums.create(req.body)
        .then(() => {
            res.sendStatus(200)
        })
        .catch(err => {
            console.log(err)
            res.sendStatus(500)
        })
})

module.exports = router