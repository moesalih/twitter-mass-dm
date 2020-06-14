import React from 'react'
import { BrowserRouter, Switch, Route, Link } from "react-router-dom"

import './App.css'


class App extends React.Component {

	render() {

		let routes = [
			{ path: '/', component: require('./Home').default },
		]

		return (
			<BrowserRouter>
				<div>
					<Switch>
						{routes.map(r =>
							<Route path={r.path} component={r.component} key={r.path}></Route>
						)}
					</Switch>
				</div>
			</BrowserRouter>
		)
	}
}


export default App
