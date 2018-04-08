module.exports = function(async, Users, Message, FriendResult){
    return {
        SetRouting: function(router){
            router.get('/settings/interest', this.getInterestPage);
            router.post('/settings/interest', this.postInterestPage);
     },
        
        getInterestPage: function(req, res){
            async.parallel([
                   function(callback){
                       Users.findOne({'username': req.user.username})
                           .populate('request.userId')
                           .exec((err, result) => {
                               callback(err, result);
                           })
                   },
                   
                    function(callback){
                     const nameRegex = new RegExp("^" + req.user.username.toLowerCase(), "i")
                     Message.aggregate(
                        {$match:{$or:[{"senderName":nameRegex}, {"receiverName":nameRegex}]}},
                        {$sort:{"createdAt":-1}},
                        {
                            $group:{"_id":{
                            "last_message_between":{
                                $cond:[     //evaluate a boolean expression and return one from two expression
                                    {
                                        $gt:[     //greater than
                                        {$substr:["$senderName",0,1]},
                                        {$substr:["$receiverName",0,1]}]
                                    },
                                    {$concat:["$senderName"," and ","$receiverName"]},
                                    {$concat:["$receiverName"," and ","$senderName"]}
                                ]
                            }
                            }, "body": {$first:"$$ROOT"}
                            }
                        }, function(err, newResult){
                            const arr = [
                                {path: 'body.sender', model: 'User'},
                                {path: 'body.receiver', model: 'User'}
                            ];
                            
                            Message.populate(newResult, arr, (err, newResult1) => {
                                callback(err, newResult);
                                });
                            }
                    )
                 }
               ], (err, results) => {
                      const result1 = results[0];
                      const result2 = results[1];
                      
                     res.render('user/interest', {title: 'WeChat - Interest', user:req.user,
                      data: result1, chat: result2});  
               });
         },
         
         postInterestPage: function(req, res){
             FriendResult.PostRequest(req, res, '/settings/interest');
             
             async.parallel([
                 function(callback){
                     if(req.body.favDepartment){
                         Users.update({
                             '_id':req.user._id,
                             'favDepartment.departmentName': {$ne: req.body.favDepartment}
                         },
                         {
                             $push: {favDepartment: {
                                 departmentName: req.body.favDepartment
                             }}
                         }, (err, result1) => {
                             callback(err, result1);
                         })
                     }
                 }
             ], (err, results) => {
                  res.redirect('/settings/interest');
             });
             
             async.parallel([
                 function(callback){
                     if(req.body.favProfessor){
                         Users.update({
                             '_id':req.user._id,
                             'favProfessor.professorName': {$ne: req.body.favProfessor}
                         },
                         {
                             $push: {favProfessor: {
                                 professorName: req.body.favProfessor
                             }}
                         }, (err, result1) => {
                             callback(err, result1);
                         })
                     }
                 }
             ], (err, results) => {
                  res.redirect('/settings/interest');
             });
             
         }
         
      }
}