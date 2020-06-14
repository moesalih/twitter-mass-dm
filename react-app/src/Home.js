import React from 'react'
import { BrowserRouter, Switch, Route, Link } from "react-router-dom"


class Home extends React.Component {

	state = { currentUser: null }

	constructor(props) {
		super(props)
	}


	render() {
		return (
			<div class="py-5">
				<div class="h1 text-center my-5">💬 Twitter Mass DM</div>

				<div class="lead text-center text-muted my-5">
					<div class="my-2">Enter your Twitter API Keys and DM your followers</div>
				</div>

			</div>
		)
	}
}

export default Home
