// (function(){
var Login = React.createClass({displayName: "Login",
	render:function(){
		return React.createElement("div", {className: "center-element", style: {border:'1px solid black',padding:3}}, 
			"Login???", 
			React.createElement(FormLayout, null, 
				React.createElement("input", {displayName: "test"}), 
				React.createElement("input", {displayName: "Password"})
			)
		);
	}
});

UI.Main = Login;

// return Login;
// })();
