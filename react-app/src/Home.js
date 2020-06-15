import React from 'react'
import { BrowserRouter, Switch, Route, Link } from "react-router-dom"


class Home extends React.Component {

	state = { twitterKeys: null, users: null }

	messageRef = React.createRef()

	constructor(props) {
		super(props)

		this.keyInfo = [
			{ name:'API key', id:'consumer_key', ref:React.createRef() },
			{ name:'API secret key', id:'consumer_secret', ref:React.createRef() },
			{ name:'Access token', id:'access_token_key', ref:React.createRef() },
			{ name:'Access token secret', id:'access_token_secret', ref:React.createRef() },
		]
	}

	componentWillMount() {
		let twitterKeys = window.localStorage.getItem('twitterKeys')
		if (twitterKeys) {
			console.log((twitterKeys));
			this.setState({ twitterKeys:JSON.parse(twitterKeys) })
		}
	}


	handleTwitterKeys = (event) => {
		event.preventDefault()

		let twitterKeys = {}
		for (var ki of this.keyInfo) {
			twitterKeys[ki.id] = ki.ref.current.value
		}

		console.log('handleTwitterKeys', twitterKeys, JSON.stringify(twitterKeys));
		this.setState({ twitterKeys: twitterKeys })
		window.localStorage.setItem('twitterKeys', JSON.stringify(twitterKeys))
	}
	removeTwitterKeys = (event) => {
		event.preventDefault()
		window.localStorage.removeItem('twitterKeys')
		this.setState({ twitterKeys:null, users:null })
	}


	getFollowers = async () => {
		if (!this.state.twitterKeys) return
		try {
			this.setState({ users: null })
			let res = await window.firebase.functions().httpsCallable('getTwitterFollowers')({
				twitterKeys: this.state.twitterKeys
			})
			console.log(res)
			this.setState({ users: res.data.users })
		} catch (error) {
			console.log(error)
			alert('Error: ' + error.message)
		}
	}

	dmFollower = async (userId, message) => {
		try {
			let res = await window.firebase.functions().httpsCallable('dmFollower')({
				twitterKeys: this.state.twitterKeys,
				userId: userId,
				message: message,
			})
			// console.log(res)


		} catch (error) {
			console.log(error)
			alert('Error: ' + error.message)
		}
	}
	dmFollowers = async () => {
		try {
			for (var user of this.state.users) {
				// console.log(user)
				await this.dmFollower(user.id_str, this.messageRef.current.value)
				user._sent = true
				this.setState({ users:this.state.users })
			}
		} catch (error) {
			console.log(error)
			alert('Error: ' + error.message)
		}
	}


	render() {
		return (
			<div class="container py-5"  style={{maxWidth:'40em'}}>
				<div class="h1 text-center my-4">💬 Twitter Mass DM</div>
				<div class="lead text-center text-muted mb-5">Enter your Twitter API Keys and DM your followers</div>

				{!this.state.twitterKeys &&
					<div class="my-5">
						<div class="h6 text-center mt-5"></div>
						<form onSubmit={this.handleTwitterKeys} class="mx-auto">

							{this.keyInfo.map(ki =>
								<div class="input-group mb-2" key={ki.id}>
									<div class="input-group-prepend">
										<div class="input-group-text d-inline-block text-left" style={{width:'10em'}}><small>{ki.name}</small></div>
									</div>
									<input type={ki.id} class="form-control" ref={ki.ref} />
								</div>
							)}

							<div class="small text-danger text-center my-4 ">{this.state.error}</div>
							<div class="text-center my-4">
								<button type="submit" class="btn btn-dark  text-capitalize">Set Twitter Keys</button>
							</div>
						</form>
					</div>
				}

				{this.state.twitterKeys &&
					<div class="my-5 text-center">
						<div class="small">
							{this.keyInfo.map(ki =>
								<div class="" key={ki.id}><span class="text-muted">{ki.name}:</span> {this.state.twitterKeys[ki.id]}</div>
							)}
							<a href="" class="" onClick={this.removeTwitterKeys}>Clear</a>
						</div>

						<div class="my-5">
							<button  class="btn btn-dark  text-capitalize" onClick={this.getFollowers}>Get Followers</button>
						</div>
					</div>
				}


				{this.state.users && this.state.users.length > 0 &&
					<div class="">

						<div class="small text-uppercase text-muted mt-5">Followers:</div>
						{this.state.users.map(u =>
							<div class="d-inline-block mr-2" key={u.id} onClick={() => this.dmFollower(u.id_str) }><span class={u._sent?'text-success':''}>{u.screen_name}</span></div>
						)}

						<div class="form-group mt-5">
							<label class="small text-uppercase text-muted" >Message</label>
							<textarea class="form-control" rows="3" ref={this.messageRef}></textarea>
					   </div>
						<button  class="btn btn-dark" onClick={this.dmFollowers}>Send Message</button>

					</div>
				}

			</div>
		)
	}
}

export default Home
