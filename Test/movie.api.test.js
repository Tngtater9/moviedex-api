const { assert, expect } = require('chai')
const supertest = require('supertest')
const app = require('../movie.api')

describe('testing movie api', () => {

    const token = 'bearer ' + process.env.API_TOKEN;

    it('returns 401 Unauthorized when no token is given', () => {
        return supertest(app)
            .get('/movies')
            .set('Authorization', 'no token')
            .expect(401)
    })
    it('returns movies with queries', () => {
        return supertest(app)
            .get('/movies')
            .set('Authorization', token)
            .expect(200)
            .then(res => {
                expect(res.body).to.be.an('array')
                expect(res.body[0]).to.be.an('object')
                expect(res.body[0]).to.include.all.keys(['filmtv_ID','film_title','year','genre','duration','country','director','actors','avg_vote','votes'])
            })
    })
    it('returns movies by genre', () => {
        return supertest(app)
            .get('/movies')
            .query({genre: 'Animation'})
            .set('Authorization', token)
            .expect(200)
            .then(res => {
                expect(res.body).to.be.an('array')
                expect(res.body[0]).to.be.an('object')
                expect(res.body[0]).to.include.all.keys(['filmtv_ID','film_title','year','genre','duration','country','director','actors','avg_vote','votes'])
                expect(res.body[0].genre).to.equal('Animation')
            })
    })
    it('returns movies by country', () => {
        return supertest(app)
            .get('/movies')
            .query({country: 'France'})
            .set('Authorization', token)
            .expect(200)
            .then(res => {
                expect(res.body).to.be.an('array')
                expect(res.body[0]).to.be.an('object')
                expect(res.body[0]).to.include.all.keys(['filmtv_ID','film_title','year','country','duration','country','director','actors','avg_vote','votes'])
                expect(res.body[0].country).to.equal('France')
            })
    })
    it('returns movies by average vote', () => {
        return supertest(app)
            .get('/movies')
            .query({avg_vote: '5'})
            .set('Authorization', token)
            .expect(200)
            .then(res => {
                expect(res.body).to.be.an('array')
                expect(res.body[0]).to.be.an('object')
                expect(res.body[0]).to.include.all.keys(['filmtv_ID','film_title','year','avg_vote','duration','country','director','actors','avg_vote','votes'])
                assert.isAtLeast(res.body[0].avg_vote, 5, 'avg_vote is greater or equal to 5')
            })
    })
})