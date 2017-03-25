	function DeallocateRole(user_role_id) {
		 $.ajax({
			 url: 'remove-account-users',
             method: 'POST',
             data : { user_roleid: user_role_id},
             success : function(html) {
            	 
            	 $.ajax({
            		 url: 'account-users',
            		 method: 'GET',
            		 success : function() {
            			 $("#display-message").html(html);
            			 setTimeout(
            					  function() 
            					  {
            						  window.location.reload();
            					  }, 1000);

            			
            		 }
            	 })
             },
             error: function(message) {
             }
         })
         }

	function AssignRole() {	
		$('#assignrole').modal({ show: false})
		var user = $("#user").val();
		var role = $("#role").val();
		$.ajax({
			type: 'POST',
			url: 'assign-roles',
			data: {user:user,role:role},
			success : function(html) {
           	 
           	 $.ajax({
           		 url: 'account-users',
           		 method: 'GET',
           		 success : function() {
           			 if (html == 'Role successfully assigned') {
		           			 $("#display-modal-message").html(html);
		           			 
		           			 setTimeout(
		           					  function() 
		           					  {
		           						  window.location.reload();
		           					  }, 2000);
		
		           		
           		   }
           	 	else {
	           	 	$("#display-modal-message").html(html);
	           	 	$('#assignrole').modal('show');
	           	 	$('#assignrole').on('hidden.bs.modal', function () {
	           	 		window.location.reload();
	           		})
           	 	}
           		 }
           	 })
            },
			error: function(message) {
            }
			
		})
	}
