function load_accounts(){
    $.ajax({
    url: "/accounts/1/",
    type: "get",
    success: function(data){
        var accounts = new Array();
        accounts = data;
        var options = '';
        var table_rows = ''
        for(var i = 0; i < accounts.length; i++){
        options += '<option value="'+accounts[i].name+'" />';
        table_rows += '<tr><td>'+accounts[i].name+' '+accounts[i].amount+'  <span class="glyphicon glyphicon-remove"';
        table_rows += ' onclick=delete_account('+accounts[i].id +')></span></td></tr>';
        }
        console.log(options);
        document.getElementById('accounts').innerHTML = options;
        document.getElementById('account-table-body').innerHTML = table_rows;
    },
    error: function(data){
            alert('errors');
    }
    });
}

function load_transactions(account_no){

    var get_url = '/transaction/1/'
    if (account_no)
        get_url += '?account='+account_no;
    $.ajax({
    url: get_url,
    type: "get",
    success: function(data){
        console.log(data);

    },
    error: function(data){
            alert('errors');
    }
    });
}

function load_tags(){
    $.ajax({
    url: "/user-tag/1/",
    type: "get",
    success: function(data){
        var tags = new Array();
        tags = data;
        var options = '';
        var table_rows = '';
        console.log(tags)
        for(var i = 0; i < tags.length; i++){
        options += '<option value="'+tags[i].name+'" />';
        table_rows += '<tr><td>'+tags[i].name+' <span class="glyphicon glyphicon-remove"';
        table_rows += ' onclick=delete_tag('+tags[i].id +')></span></td></tr>';
        }
        console.log(options);
        document.getElementById('tags').innerHTML = options;
        document.getElementById('tags-table-body').innerHTML = table_rows;
    },
    error: function(data){
            alert('errors');
    }
    });
}

$(document).ready(function(){
    load_accounts();
    load_transactions();
    load_tags();
});

function add_account_toggle(){
    if (document.getElementById('add-account-btn').style.display != 'none'){
        document.getElementById('add-account-btn').style.display = 'none';
        document.getElementById('add-account-form').style.display = 'block';
    }
    else{
        document.getElementById('add-account-btn').style.display = 'block';
        document.getElementById('add-account-form').style.display = 'none';
    }
}

function add_tag_toggle(){
    if (document.getElementById('add-tag-btn').style.display != 'none'){
        document.getElementById('add-tag-btn').style.display = 'none';
        document.getElementById('add-tag-form').style.display = 'block';
    }
    else{
        document.getElementById('add-tag-btn').style.display = 'block';
        document.getElementById('add-tag-form').style.display = 'none';
    }
}

function create_account(){
    var account_name = document.getElementById('add-account-form-name').value;
    var account_amount = document.getElementById('add-account-form-amount').value;
    $.ajax({
        url: "/accounts/1/",
        type: "post",
        data: {
            name: account_name,
            amount: account_amount
        },
        success: function(data){
            load_accounts();
        },
        error: function(error){
            console.log(error);
        }
    });
}

function create_tag(){
    var tag_name = document.getElementById('add-tag-name').value;
    $.ajax({
        url: "/user-tag/1/",
        type: "post",
        data: {
            name: tag_name
        },
        success: function(data){
            load_tags();
        },
        error: function(error){
            console.log(error);
        }
    });
}

function create_transaction(){
}

function delete_account(account_id){
    $.ajax({
        url: "/accounts/"+account_id+"/",
        type: "delete",
        success: function(data){
            load_accounts();
        },
        error: function(error){
            console.log(error);
        }
    });
}

function delete_transaction(transaction_id){
    $.ajax({
        url: "/transaction/"+transaction_id+"/",
        type: "delete",
        success: function(data){
            load_transactions();
        },
        error: function(error){
            console.log(error);
        }
    });
}

function delete_tag(tag_id){
    $.ajax({
        url: "/user-tag/"+tag_id+"/",
        type: "delete",
        success: function(data){
            load_tags();
        },
        error: function(error){
            console.log(error);
        }
    });
}
