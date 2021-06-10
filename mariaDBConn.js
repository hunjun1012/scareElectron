
var mariadb = require('mariadb');
var conn, rows, query;
var bcrypt = require('bcrypt-nodejs');
var db_config  = require('./db_config.json');

//mariadb 연결
const pool = mariadb.createPool({
  host: db_config.host,
  port: db_config.port,
  user: db_config.user,
  password: db_config.password,
});

//users 테이블에서 아이디 비밀번호 연결
async function loginCheck(id, password) {
  try {
    conn = await pool.getConnection();
    conn.query('USE sensorvalue');
    query = 'SELECT * FROM users where id="'+id+'" and password="'+password+'"';
    rows = conn.query(query);  
  }
  catch (err) {
    throw err;
  }
  finally {
    if (conn) conn.end();
    return rows;
  }
}
//setuser
function setCurrentUser(user){
  global.user = user;
  console.log("current user set to");
  console.log(global.user);
}
//getuser
function getCurrentUser(){
  return this.user;
}
//users 연결
async function GetUserList() {
  try {
    conn = await pool.getConnection();
    conn.query('USE sensorvalue');
    rows = 'SELECT * FROM users';
  }
  catch (err) {
    throw err;
  }
  finally {
    if (conn) conn.end();
    return rows;
  }
}
//getUser
async function getUser(id){
  try {
    conn = await pool.getConnection();
    conn.query('USE sensorvalue');
    query = 'SELECT * FROM users where id="'+id+'"';
    console.log(query);
    rows = conn.query(query);    
  }
  catch (err) {
    throw err;
  }
  finally {
    if (conn) conn.end();
    return rows;
  }
}
//getPosts
async function getPosts(){
  try {
    conn = await pool.getConnection();
    conn.query('USE sensorvalue');
    query = 'SELECT * FROM posts';
    console.log(query);
    rows = conn.query(query);    
  }
  catch (err) {
    throw err;
  }
  finally {
    if (conn) conn.end();
    return rows;
  }
}

//users 테이블 업데이트
async function posts() {
  conn.query('SELECT * FROM posts');  
}
//users 테이블 업데이트 2021.04.15 : render에 있는 temp 변수 추가하고 addtemperature디비 개체랑 동기화 시키기
async function setTemp(id, temperature, addtemp, isLoggedin, ) {
  console.log("테스트 로그: ", id, temperature, addtemp, isLoggedin);
  conn.query('UPDATE users SET temperature = "' + temperature + '" , updated_at = CURTIME() , addtemperature = '+addtemp+', isLoggedin = '+isLoggedin+' WHERE id="' + id + '"');  
}
//sensored_datas 테이블 인서트
async function insertTemp(id, name, team, temperature) {
  console.log(id, name, team, temperature);
  conn.query('INSERT INTO sensored_datas(id, name, team, temperature, updated_at) VALUES ("'+id+'", "'+name+'", "'+team+'", "'+temperature+'", CURTIME()) ON DUPLICATE KEY UPDATE updated_at = updated_at;');
}
//is_loggedin_datas 테이블 인서트
async function insertLoggedin(id, name, team, isLoggedin) {
  console.log(id, name, team, isLoggedin);
  conn.query('INSERT INTO is_loggedin_datas(id, name, team, isLoggedin, updated_at) VALUES ("'+id+'", "'+name+'", "'+team+'", '+isLoggedin+', CURTIME()) ON DUPLICATE KEY UPDATE updated_at = updated_at;');
}

module.exports = {
  getUserList: GetUserList,
  loginCheck: loginCheck,
  setCurrentUser: setCurrentUser,
  getCurrentUser: getCurrentUser,
  getUser: getUser,
  setTemp: setTemp,
  insertTemp: insertTemp,
  insertLoggedin: insertLoggedin,
  
  posts: posts,
  getPosts: getPosts,
}



