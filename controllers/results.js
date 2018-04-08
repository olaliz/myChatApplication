module.exports = function(async, Lifestyle, Users){
    return {
        SetRouting: function(router){
            router.get('/results', this.getResults);
            router.post('/results', this.postResults);
            
            router.get('/students', this.viewStudents);
            router.post('/students', this.searchStudents);
        },
        
        getResults: function(req, res){
            res.render('/home');
        },
        
        postResults: function(req, res){
            async.parallel([
                function(callback){
                    const regex = new RegExp((req.body.faculty), 'gi');
                    
                    Lifestyle.find({'$or': [{'faculty': regex}, {'department': regex}]}, (err, result) => {
                       callback(err, result); 
                    });
                }
            ], (err, results) => {
                const res1 = results[0];
                
                const dataChunk  = [];
                const chunkSize = 3;
                for (let i = 0; i < res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }
                
                res.render('results', {title: 'WeChat - Results', user: req.user, chunks: dataChunk});
           })
        },
        
        viewStudents: function(req, res){
           async.parallel([
                function(callback){
                    Users.find({}, (err, result) => {
                       callback(err, result); 
                    });
                }
            ], (err, results) => {
                const res1 = results[0];
                
                const dataChunk  = [];
                const chunkSize = 4;
                for (let i = 0; i < res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }
                
                res.render('students', {title: 'WeChat - Students', user: req.user, chunks: dataChunk});
           })
        },
        
        searchStudents: function(req, res){
            async.parallel([
                function(callback){
                    const regex = new RegExp((req.body.username), 'gi');
                    
                    Users.find({'username': regex}, (err, result) => {
                       callback(err, result);   
                   });
                }
            ], (err, results) => {
                const res1 = results[0];
                
                const dataChunk  = [];
                const chunkSize = 4;
                for (let i = 0; i < res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }
                
                res.render('students', {title: 'WeChat - Students', user: req.user, chunks: dataChunk});
            })
        }
    }
}

