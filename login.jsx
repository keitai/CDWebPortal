// (function(){
var Login = React.createClass({
	render:function(){
		return <div className="center-element" style={{border:'1px solid black',padding:3}}>
			Login???
			<FormLayout>
				<input displayName="test" />
				<input displayName="Password" />
			</FormLayout>
		</div>;
	}
});

UI.Main = Login;

// return Login;
// })();
