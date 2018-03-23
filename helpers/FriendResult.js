module.exports = function(async, Users, Message){
    return {
       PostRequest: function(req, res, url){
          async.parallel([
          //sending friend request
                 function(callback){    
                     if(req.body.receiverName){
                         Users.update({           //update receiver information to show request sent to receiver
                            'username': req.body.receiverName,
                            'request.userId': {$ne: req.user._id},
                            'friendsList.friendId': {$ne: req.user._id}
                         },
                         {
                                $push: {request: {
                                    userId: req.user._id,
                                    username: req.user.username
                                }},
                                $inc: {totalRequest: 1}
                            }, (err, count) => {
                                callback(err, count);
                            })
                     }
                 },
                 //update sender information to show request sent
                   function(callback){
                       if(req.body.receiverName){
                           Users.update({
                                 'username': req.user.username,
                                 'sentRequest.username': {$ne: req.body.receiverName}
                           }, 
                           {
                               $push: {sentRequest: {
                                   username: req.body.receiverName
                               }}
                           }, (err, count) => {
                                 callback(err, count);
                           })
                       }
                   }
             ], (err, results) => {
                   res.redirect(url)
             });
             
             //Accepting and canceling friend request
             async.parallel([
                function(callback){
                    if(req.body.senderId){
                        Users.update({                   //if accept button is clicked this will execute
                           '_id': req.user._id,
                           'friendsList.friendId': {$ne: req.body.senderId}     //if incoming id does not exist in the friend list then update the friend list with the info
                        }, {
                             $push: {friendsList: {
                                  friendId: req.body.senderId,
                                  friendName: req.body.senderName
                             }},
                             //remove the content/data from the request array after the request is accepted
                             $pull: {request: {
                                  userId: req.body.senderId,
                                  username: req.body.senderName
                             }},
                             //reduce the total request list by 1 after accept
                             $inc: {totalRequest: -1}
                            }, (err, count) => {
                                   callback(err, count);
                        });
                    }
                },
                //update from the sender end after accepting friend request
                function(callback){
                    if(req.body.senderId){
                        Users.update({                   
                           '_id': req.body.senderId,
                           'friendsList.friendId': {$ne: req.user._id}     
                        }, {
                             $push: {friendsList: {
                                  friendId: req.user._id,
                                  friendName: req.user.username
                             }},
                             $pull: {sentRequest: {
                                  username: req.user.username
                             }},
                            }, (err, count) => {
                                   callback(err, count);
                          });
                       }
                },  
                    
                //cancel update from receiver end
                   function(callback){
                    if(req.body.user_Id){
                        Users.update({                   
                           '_id': req.body.user_Id,   //check for logged in user id
                           'request.userId': {$eq: req.body.user_Id}      //check for incoming id
                        }, {
                             $pull: {request: {
                                  userId: req.body.user_Id
                             }},
                             $inc: {totalRequest: -1}
                            }, (err, count) => {
                                   callback(err, count);
                        });
                    }
                },
                //cancel update from sender end
                function(callback){
                    if(req.body.user_Id){
                        Users.update({                   
                           '_id': req.body.user_Id,
                           'sentRequest.username': {$eq: req.user.username}     
                        }, {
                             $pull: {sentRequest: {
                                  username: req.user.username
                             }}
                            }, (err, count) => {
                                   callback(err, count);
                        });
                    }
                },
                
                function(callback){
                        if(req.body.chatId){
                           Message.update({
                              '_id': req.body.chatId
                           }, 
                           {
                               "isRead": true
                           }, (err, done) => {
                               callback(err, done);
                           })
                        }
                     }    
                
             ], (err, results) => {
                   res.redirect(url);
             });
       }
    }
}