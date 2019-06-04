$( document ).ready(function() {

	$.ajax({
		method: "GET",
		url: "https://dry-wildwood-48050.herokuapp.com/std/user",
	}) 
	.done(function(resp) {
		
		console.log(resp);
		resp.forEach(function(user) {
			
		var ou=$("#data");
		var stat;
		var row = $("<tr></tr>");
		var idUser = "<td >"+user.id+"</td>"
		var cardKey = "<td class = ' card_key'>"+user.card_key+"</td>";
		var firstName = "<td class = 'first_name'>"+user.first_name+"</td>";
		var lastName = "<td class = 'last_name'>"+user.last_name+"</td>";
		var time ="<td>" +(user.last_checked_in ? new Date(user.last_checked_in).toLocaleString('uk-UA') : "Never entered")+"</td>";
		var statt = user.status;
		
		if(user.status == 1){
			var status ="<td class='round color_success'>"+ "Active"+"</td>";
		}
		else{
			var status ="<td class='round color_danger'>"+"Blocked"+"</td>";
		}
		
		if(user.status == 1){
			 var buttonChangeStatus = "<button class ='btn btn-danger box' id = 'block_user_"+user.id+"'><i class='fas fa-lock'></i></button>";
		}
		else{
			 var buttonChangeStatus = "<button class ='btn btn-success box' id = 'unblock_user_"+user.id+"'><i class='fas fa-lock-open'></i></button>";
		}
		
        var buttonUpdate = "<td><button class ='btn btn-primary  box' id = 'update_user_"+user.id+"'><i class='fas fa-user-edit'></i></button>";
		var buttonDeactivate = "<button class ='btn btn-secondary  box' id = 'deactivate_user_"+user.id+"'><i class='fas fa-ban'></i></button>";
	    var buttonlogs = "<button class ='btn btn-primary box1' id = 'logs_user_"+user.id+"'>Logs</button></td>";
	
    row.append(idUser)
    row.append(cardKey)
    row.append(firstName)
    row.append(lastName)
    row.append(status)
    row.append(time)
    row.append(buttonUpdate + buttonChangeStatus + buttonDeactivate + buttonlogs)
    ou.append(row)
	
	$("#deactivate_user_"+user.id).click(function (e) {
		$.ajax({
  			method: "PUT",
  			url: "https://dry-wildwood-48050.herokuapp.com/std/user/deactivate/"+user.id,
  			success: function(result) { alert('User was deactivated') ;  location.reload(); },
  			error: function(result) { alert('Deactivation error') ;  }
 		});
	})
	
	$("#block_user_"+user.id).click(function (e) {
		$.ajax({
  			method: "PUT",
  			url: "https://dry-wildwood-48050.herokuapp.com/std/user/blocked/"+user.id,
  			success: function(result) { alert('User was blocked') ;  location.reload(); },
  			error: function(result) { alert('Blocking error') ;  }
 		});
	})
	
		$("#unblock_user_"+user.id).click(function (e) {
		$.ajax({
  			method: "PUT",
  			url: "https://dry-wildwood-48050.herokuapp.com/std/user/unblocked/"+user.id,
  			success: function(result) { alert('User was unblocked') ;  location.reload(); },
  			error: function(result) { alert('Unblocking error') ;  }
 		});
	})
		
	$("#update_user_"+user.id).click(function (e) {
		
		var row = $(this).parent().parent();
		var card_key = row.find(".card_key").html();
		var first_name = row.find(".first_name").html();
		var last_name = row.find(".last_name").html();
		
		
		$('#update_user_id').val(user.id);
		$('#fn3').val(first_name);
		$('#ln3').val(last_name);
		$('#ck3').val(card_key);
		$('#status').val(statt);
		
		$('#myModal3').modal('toggle')
	})
		
	$("#logs_user_"+user.id).click(function (e) {
		
		$.ajax({
			method: "GET",
			url: "https://dry-wildwood-48050.herokuapp.com/std/logs/"+user.id,
		}) 
		.done(function(resp) {
			console.log(resp);
			resp.forEach(function(user) {
			var ou=$("#data2");
			
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
			
			var row = $("<tr class='modalDelete'></tr>");
			var iDUser = "<td>"+user.Id+"</td>"
			var userId = "<td>"+user.UserId+"</td>";
			var createdAt = "<td>"+new Date(user.CreatedAt).toLocaleString('uk-UA')+"</td>";
			var eventType = ET;

			row.append(iDUser)
			row.append(userId)
			row.append(createdAt)
			row.append(eventType)
			ou.append(row)
		});
	})
	.fail(function(resp) {
		console.log(resp);
	});
		// modal toggle
	$('#myModal4').modal('toggle')
			
	})	
	})
	})
	.fail(function(resp) {
		console.log(resp);
	});
});

function refreshModal()
{
	$( ".modalDelete" ).empty();
};


function add (a,b,d) { 
	var A = document.getElementById(a).value;
	var B = document.getElementById(b).value;
	var D = document.getElementById(d).value; 
	$.ajax({
		method: "POST",
		url: "https://dry-wildwood-48050.herokuapp.com/std/user",
		dataType:"json",
		data: JSON.stringify({
		card_key : parseInt(D),
		first_name :A,
		last_name : B
		}),
		success: function(data) { alert('User was added') ; location.reload(); },
		error: function(data) { alert('Error') ; }
	});
};

function update(a,b,c,d,f) { 
	var A = document.getElementById(a).value;
	var B = document.getElementById(b).value;
	var C = document.getElementById(c).value;
	var D = document.getElementById(d).value;
	var F = document.getElementById(f).value;
	
	$.ajax({
		url: "https://dry-wildwood-48050.herokuapp.com/std/user/update/"+A,
		method: "PUT",
		dataType:"json",
		data: JSON.stringify({
		first_name : B,
		last_name : C,
		card_key : parseInt(D),
		status: parseInt(F),
		active: true
	}),	
    success: function(data) { alert('User was updated') ; location.reload();},
    error: function(data) { alert('Error') ; }
	});
};

function move(){
	location.href = 'logs.html' 
}



