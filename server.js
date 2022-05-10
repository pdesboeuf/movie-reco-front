const express = require('express');
const axios = require('axios');
const { engine } = require('express-handlebars');
const app = express();
var router = express.Router();

// setup app
app.use(express.static('public'));
app.engine('handlebars', engine({
    defaultLayout: 'main',
    extname: '.handlebars',
    helpers: {
        getShortComment(comment) {
            if (comment.length < 64) {
                return comment;
            }

            return comment.substring(0, 61) + '...';
        },

        compareStrings(p, q, options) {
            return (p == q) ? options.fn(this) : options.inverse(this);
        },

        getPoster(data) {
            if(data.posters[0] !== undefined)
                return data.posters[0].link;
        },

        isNull(p) {
            console.log("*** isNull ***" + "=>" + (p != ''));
            return (p != '');
        },
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './views');


const recommendationsDetails = async function getRecommendationsDetails(listId) {
    try {
        const result = listId.map(async(movie) => {
            return await movieInfos(movie.id, movie.title)
        });
        return Promise.all(result).then(listMovies => {
            console.log("*** listMovies ***" + "=>");
            console.log(listMovies);
            return listMovies;
        });      
    
    } catch (error) {
        console.log(error);
    }
};



const recommendations = async function getRecommendations(id) {
    let idMovies = [];
    try {
        const { data } = await axios.get(
            "http://localhost:5000/match/id/" + id
        );
        //idMovies = data.map(movie => movie.tconst);
        idMovies = data.map(movie => {
            return {
                title: movie.title,
                id: movie.tconst
            };
            
        });
        console.log("http://localhost:5000/match/id/" + id + "=>");
        console.log(idMovies);
        return idMovies;

        } catch (error) {
            console.log(error);
        }
};


const movieInfos = async function getInfos(id, title) {
    try {
        /*const { data } = await axios.get(
            //"http://localhost:5000/search2/id/" + id, {timeout: 5000}
            "http://192.168.1.87:5000/search/id/" + id, {timeout: 5000}
        );*/
        const { data } = await axios({
                method: 'get',
                url: "http://localhost:5000/search/id/" + id,
                timeout: 3000
            });
        //idMovies = data.map(movie => movie.tconst);
        //console.log("http://localhost:5000/search2/id/" + id + "=>");
        console.log("http://localhost:5000/search/id/" + id + "=>");
        console.log(data);
        if(data.Poster == 'N/A') data.Poster = 'https://imdb-api.com/images/original/nopicture.jpg'
        data.Title = title;
        return data;

    } catch (error) {
        console.log(error);
    }
};

// router
// get Form query and get recommendations
app.get('/result', function(req, res, next){
    
    var res_body = {
        title: req.query.title,
        id: req.query.tconst_id
    };

    console.log("Form response :" + res_body.id + '/' + res_body.title);

    var dataMovie = movieInfos(res_body.id, res_body.title);
    var idMovies = dataMovie.then(data => recommendations(data.imdbID));
    //var idMovies = dataMovie.then(data => recommendations(data.id));
    var recMovies = idMovies.then(listId => recommendationsDetails(listId));
    
    Promise.all([dataMovie, idMovies, recMovies]).then(([dataMovie, idMovies, recMovies]) => {
        console.log("******** dataMovie ********");
        console.log([dataMovie]);
        console.log("******** idMovies ********");
        console.log(idMovies);
        console.log("******** recMovies ********");
        console.log(recMovies);
        res.render('result', {
            layout : 'main',
            movieInfo : [dataMovie],
            recMovies : recMovies
        })
    });

    /*res.render('search', {
        layout : 'main'
    });*/
});

app.get('/', (req, res) => {
    //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
    res.render('home', {layout : 'main'});
});

app.get('/search', function (req, res) {
    res.render('search', {
        layout : 'main'
    });
});

/*app.get('/result', function (req, res) {
    res.render('result', {
        layout : 'main'
    });
});*/

/*app.get('/search', function (req, res) {
    res.render('search', {
        layout : 'main' , 
        posts: [
            {
                author: 'Janith Kasun',
                image: 'https://picsum.photos/500/500',
                data: 'unemployment',
                comments: [
                    'This is the first comment',
                    'This is the second comment',
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec fermentum ligula. Sed vitae erat lectus.'
                ]
            },
            {
                author: 'John Doe',
                image: 'https://picsum.photos/500/500?2',
                data: 'unemployment',
                comments: [
                ]
            }
        ]
    });
});*/


app.get('/api/data/exemple', (req, res) => {
    const data = [100, 50, 300, 40, 350, 250]; // assuming this is coming from the database
    res.json(data);
});

app.get('/api/data/unemployment', (req, res) => {
    const unemployment = require('./data/unemployment.json');

    res.json(unemployment);
});

app.listen(3000, '0.0.0.0');