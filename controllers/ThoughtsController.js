const Thought = require('../models/Thought');
const User = require('../models/User');

const { Op } = require('sequelize');

module.exports = class ThoughtsController {
    static async dashboard(req, res) {
        const userId = req.session.userid;

        if(['', undefined, null].includes(userId)){
            res.redirect('/login');
            return;
        }

        const user = await User.findOne({
            where: {id: userId},
            include: Thought,
            plain: true
        });

        if(!user){
            res.redirect('/login');
            return;
        }

        let emptyThoughts = false;

        const thoughts = user.Thoughts.map((result)=> result.dataValues);

        if(thoughts.length === 0){
            emptyThoughts = true;
        }

        res.render('thoughts/dashboard', {thoughts, emptyThoughts});
    }

    static createThought(req, res) {
        res.render('thoughts/create');
    }

    static async createThoughtPost(req, res) {
        const data = {
            title: req.body.title,
            UserId: req.session.userid
        }

        try {
            await Thought.create(data);

            req.flash('message', 'Pensamento criado com sucesso!');

            req.session.save(() => {
                res.redirect('/thoughts/dashboard');
            })
        } catch (e) {
            console.log(e);
        }
    }

    static async showThoughts(req, res) {

        let search = '';

        if(req.query.search){
            search = req.query.search;
        }

        let order = 'DESC';

        if(req.query.order === 'old'){
            order = 'ASC';
        }else{
            order = 'DESC';
        }

        const thoughtsData = await Thought.findAll({
            include: User,
            where: {
                title: {[Op.like]: `%${search}%`}
            },
            order: [['createdAt', order]]
        });

        const thoughts = thoughtsData.map((result) => result.get({plain: true}));

        let thoughtsQty = thoughts.length

        if(thoughtsQty === 0){
            thoughtsQty = false;
        }

        res.render('thoughts/home', {thoughts, search, thoughtsQty});
    }

    static async removeThought(req, res){
        const id = req.body.id;
        const userId = req.session.userid;

        try{
            await Thought.destroy({where: {id:id, UserId: userId}});
            
            req.flash('message', 'Pensamento removido com sucesso!');

            req.session.save(() => {
                res.redirect('/thoughts/dashboard');
            });
        }catch(e){
            console.log(e);
        }
    
        
    }

    static async updateThought(req, res){
        const id = req.params.id;

        const thought = await Thought.findOne({where: {id: id}, raw: true});

        res.render('thoughts/edit', {thought});
    }

    static async updateThoughtPost(req, res){
        const {id, title} = req.body;

        const data = {
            id,
            title
        }

        try{
            await Thought.update(data, {where: {id: id}});

            req.flash('message', 'Pensamento atualizado com sucesso!');

            req.session.save(() => {
                res.redirect('/thoughts/dashboard');
            })
        }catch(e){
            console.log(e);
        }

    }
}