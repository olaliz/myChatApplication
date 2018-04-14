'use strict';

module.exports = function(_, passport, User){

     return{
          SetRouting: function(router){
          
          //get routing events
              router.get('/', this.indexPage);
              router.get('/signup', this.getSignUp);
              router.get('/auth/google', this.getGoogleLogin);
              router.get('/auth/google/callback', this.googleLogin);
              
              
              
              //post routing events
              router.post('/', User.LoginValidation, this.Loginposting);
              router.post('/signup', User.SignUpValidation, this.SignUpposting);
            },
            
            indexPage: function(req, res){
                const errors = req.flash('error');
                return res.render('index', {title: 'lizochat | Login', messages: errors, hasErrors: errors.length > 0});
            },
            
            Loginposting: passport.authenticate('local.login', {
                 successRedirect: '/home',  //if successful take user to home page
                 failureRedirect: '/',     //if not seccessful remain on index page
                 failureFlash: true        //flash failure message
            }),
            
            
            getSignUp: function(req, res){
               const errors = req.flash('error');
               return res.render('signup', {title: 'lizochat | SignUp', messages: errors, hasErrors: errors.length > 0});
          },
            
            SignUpposting: passport.authenticate('local.signup', {
                 successRedirect: '/home',
                 failureRedirect: '/signup',
                 failureFlash: true
            }),
            
            
            
            getGoogleLogin: passport.authenticate('google', {
                scope: ['https://www.googleapis.com/auth/plus.login',
                         'https://www.googleapis.com/auth/plus.profile.emails.read']
            }),
            
            googleLogin: passport.authenticate('google', {
                 successRedirect: '/home',
                 failureRedirect: '/signup',
                 failureFlash: true
            }),
            
        }
    }