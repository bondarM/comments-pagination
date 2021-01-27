import React, { Component } from 'react'
import axios from 'axios'


export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            comments: null,
            lastPage: null,
            myRef: React.createRef(),
            circle:[],
            blockCircle:React.createRef(),
            c:null,
            currentPage:null

        }
    }
    componentDidMount() {
        this.getLastPage();
    }
    

    getLastPage() {
        axios
            .get(`https://jordan.ashton.fashion/api/goods/30/comments`)
            .then((res) => {
                this.setState({ lastPage: res.data.last_page }, () => { });
                this.getComments(this.state.lastPage)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getComments(page) {
        axios
            .get(`https://jordan.ashton.fashion/api/goods/30/comments?page=${page}`)
            .then((res) => {
                this.lengthButton()
                this.setState({ comments: res.data.data.reverse() }, () => { });
                this.setState({ currentPage: res.data.current_page }, () => { });
                console.log(this.state.currentPage);
                
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getUsers = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    createComment() {
        if(this.state.name !== ' ' || this.state.comment !== ' '){
            axios
            .post(`https://jordan.ashton.fashion/api/goods/30/comments`, {
                name: this.state.name,
                text: this.state.comment,
            })
            .then((res) => {
                let createComment = {
                    name: this.state.name,
                    text: this.state.comment,
                }
                this.setState({ comments: [...this.state.comments, createComment] }, () => { });
                this.getComments(this.state.lastPage)
                this.state.name = ''
                this.state.comment = ''
            })
            .catch((err) => {
                console.log(err);
            });
        }
       

    }
    getMore() {
        this.setState({ lastPage: this.state.lastPage - 1 }, () => {
            console.log(this.state.lastPage)
            if (this.state.lastPage >= 1) {
                axios
                    .get(`https://jordan.ashton.fashion/api/goods/30/comments?page=${this.state.lastPage}`)
                    .then((res) => {

                        const arr = res.data.data.map((el, i) => {
                            return this.setState({ comments: [...this.state.comments, el] });
                        })
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            if (this.state.lastPage == 1) {
                this.state.myRef.current.style.display = 'none'
            }

        });

    }
 
    lengthButton(){
        for(let i = 1; i <= this.state.lastPage; i++ ){
            this.state.circle.push({i})
        }
        
        const c = this.state.circle.map((el,i)=>{
            return (<p onClick={() => this.getNumberPage(el.i)} className="circle" key={i}> {el.i} </p>)
        })
        this.state.c = c.slice(0, this.state.lastPage)
        
    }

    getNumberPage(num){
        this.getComments(num) 
       
    }

    prevPage(){
        if(1 <= this.state.currentPage+1){
            this.getComments(this.state.currentPage-1)
        }
            
    }
    nextPage(){
        if(this.state.lastPage >= this.state.currentPage+1){
            this.getComments(this.state.currentPage+1)
        }
        
    }


    render() {
        if (this.state.comments != null) {
            const comments = this.state.comments.map((el, i) => {

                return (<div key={i} className="comment">
                    <h1>{el.name}</h1>
                    <p>{el.text}</p>
                </div>
                )
            })
           
  
            
            return (

                <div className="wrapper">
                    <div className="d-flex ">
                        <div className="input__block">
                            <label for="name"> Name</label>
                            <input
                                onChange={this.getUsers}
                                type="text"
                                className=" user__name"
                                placeholder="Enter name"
                                name="name"
                                value={this.state.name}
                            />
                            <label for="comment">Comment</label>

                        </div>
                        <textarea onChange={this.getUsers}
                            type="text"
                            className="user__name"
                            placeholder="Enter comment"
                            name="comment"
                            value={this.state.comment}></textarea>
                        <button
                            onClick={this.createComment.bind(this)}
                            className="bt__section  "
                        >
                            Add comment
                        </button>

                        </div>
                        <div >{comments}</div>
                        <div  ref = {this.state.blockCircle} className="block__circle">
                      <div className="flex">
                      <div className="prev" onClick={this.prevPage.bind(this)}>prev</div>   {this.state.c ? this.state.c : (<div>no</div>)}    <div className='next' onClick={this.nextPage.bind(this)}>next</div> 
                          </div> 
                          <button
                            ref={this.state.myRef}
                            onClick={this.getMore.bind(this)}
                            className="bt__section m-auto">
                                View more
                            </button>
                        </div>
                      
                </div>
            )
        } else {
            return (<div className="notfound"></div>)
        }


    }
}

