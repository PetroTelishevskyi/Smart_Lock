$( document ).ready(function() {

	$.ajax({
		method: "GET",
	url: "https://dry-wildwood-48050.herokuapp.com/std/logs",
	}) 
	.done(function(resp) {
		console.log(resp);
		resp.forEach(function(user) {
		var ET; 	
		if (user.EventType == 1) 
			ET = "<td class='round color_success'>User authentificated succesfully</td>";
		if(user.EventType == 2)
			ET= "<td class='round color_danger'>Authentification failed, user blocked</td>"
		if(user.EventType == 3)
			ET= "<td class='round color_danger'>Authentification failed, unknown card key</td>";
		if(user.EventType == 4)
			ET= "<td class='round color_danger'>User was blocked</td>";
		if(user.EventType == 5)
			ET= "<td class='round color_success'>User was unblocked</td>";
		if(user.EventType == 6)
			ET= "<td class='round color_success'>User was created</td>";
		if(user.EventType == 7)
			ET= "<td class='round color_info'>User was updated</td>";
		if(user.EventType == 8)
			ET= "<td class='round color_danger'>User was deactivated</td>";
		if(user.EventType == 9)
			ET= "<td class='round color_info'>Lock was open</td>";
		var usid;
		if (user.UserId == 0)
			usid = "none";
		else
			usid = user.UserId;
		var ou=$("#data")
		var time2= new Date(user.CreatedAt).toLocaleString('uk-UA')
		ou.append("<tr>"+"<td>"+user.Id+"</td>"+"<td>"+usid+"</td>"+"<td>"+time2+"</td>"+ET+"</tr>");
		});
	})
	.fail(function(resp) {
		console.log(resp);
	});
});

function move1(){
	location.href = 'index.html' 
}




