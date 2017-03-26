function load_accounts(){
    $.ajax({
    url: "/accounts/1/",
    type: "get",
    success: function(data){
        var accounts = new Array();
        accounts = data;
        var options = '';
        var table_rows = ''
        var total_amount = 0;
        for(var i = 0; i < accounts.length; i++){
        options += '<option value="'+accounts[i].id+'"> '+accounts[i].name+'</option>';
        table_rows += '<tr><td>'+accounts[i].name+' '+accounts[i].amount+'  <span class="glyphicon glyphicon-remove"';
        table_rows += ' onclick=delete_account('+accounts[i].id +')></span></td></tr>';
        total_amount += accounts[i].amount;
        }
        table_rows += '<tr><td> all accounts '+total_amount+'</td></tr>';
        console.log(options);
        document.getElementById('header-form-primary-accounts').innerHTML = options;
        document.getElementById('header-form-secondary-accounts').innerHTML = options;
        document.getElementById('account-table-body').innerHTML = table_rows;
    },
    error: function(error){
            alert(error.responseText);
    }
    });
}

function load_transactions(account_no=null, transaction_type = null, for_date=null){
    var get_url = '/transaction/1/'
    var get_data = {}
    if (account_no)
        get_data = {account: account_no};
    if (transaction_type)
        get_data.type = transaction_type;
    if (for_date)
        get_data.for_date = for_date;
    console.log(get_data);
    $.ajax({
    url: get_url,
    data: get_data,
    type: "get",
    success: function(data){
        var rows = ''
        var empty_cell = '<td> - </td>'
        var transactions = data;
        var monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        var month = monthNames[Number(document.getElementById('datepicker').value.split('-')[1])-1];
        document.getElementById('datepicker').value.split('-')[1];
        var title = '<h4>Transactions for '+month+'</h4>';
        for (var i=0; i< transactions.length; i++){
            rows += '<tr><td>'+ transactions[i].type+'</td>';
            rows += '<td>'+transactions[i].amount+'</td>';
            if (transactions[i].tag){
            rows += '<td style="background-color:'+stringToColour(transactions[i].tag.name)+'">'+transactions[i].tag.name+'</td>';}
            else{
            rows += empty_cell;}
            rows += '<td>'+transactions[i].primary_account.name+'</td>';
            if (transactions[i].secondary_account){
            rows += '<td>'+transactions[i].secondary_account.name+'</td>';}
            else{
            rows += empty_cell;}
            rows += '<td><span class="glyphicon glyphicon-remove" onclick="delete_transaction('+transactions[i].id;
            rows += ')"></span></td>'

        }
        document.getElementById('dashboard-table-body').innerHTML = rows;
        document.getElementById('dashboard-table').innerHTML = title;
    },
    error: function(error){
            alert(error.responseText);
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
        var options = '<option value="">Tags</option>';
        var table_rows = '';
        console.log(tags)
        for(var i = 0; i < tags.length; i++){
        options += '<option value="'+tags[i].id+'">'+tags[i].name+'</option>';
        table_rows += '<tr><td style="background-color:'+stringToColour(tags[i].name) +'">';
        table_rows+=tags[i].name+' <span class="glyphicon glyphicon-remove"';
        table_rows += ' onclick=delete_tag('+tags[i].id +')></span></td></tr>';
        }
        console.log(options);
        document.getElementById('tags').innerHTML = options;
        document.getElementById('tags-table-body').innerHTML = table_rows;
    },
    error: function(error){
            alert(error.responseText);
    }
    });
}

$(document).ready(function(){
    $( function() {
    $( "#datepicker" ).datepicker({
        dateFormat: "yy-mm-dd"
        }
    );
  } );
    load_accounts();
    load_tags();
    var current_date = new Date();
    for_date = current_date.toISOString().split('T')[0];
    document.getElementById('datepicker').value = for_date;
    load_transactions(null,null,for_date);
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
            alert(error.responseText);
        }
    });
}

function update_transactions_list(){
    for_date = document.getElementById("datepicker").value;
    load_transactions(null,null,for_date);
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
            alert(error.responseText);
        }
    });
}

function create_transaction(){
    var select_element = document.getElementsByName('transaction_type')[0];
    var transaction_type = select_element.selectedOptions[0].value;
    var transaction_amount = document.getElementsByName('amount')[0].value;
    var user_tag = document.getElementById('tags').value;
    var primary_account = document.getElementById('header-form-primary-accounts').value;
    var secondary_account = document.getElementById('header-form-secondary-accounts').value;
    var transaction_date = document.getElementById('datepicker').value;
    var postdata = {}
    if (['BalanceReset', 'Expense', 'Income'].indexOf(transaction_type) > -1 ){
        postdata = {
            type: transaction_type,
            amount: transaction_amount,
            tag: user_tag,
            primary_account: primary_account,
            for_date: transaction_date
        }
    }
    else if (transaction_type === 'Transfer'){
        postdata = {
            type: transaction_type,
            amount: transaction_amount,
            tag: user_tag,
            primary_account: primary_account,
            for_date: transaction_date,
            secondary_account: secondary_account
        }
    }
    console.log(postdata);
    $.ajax({
        url: "/transaction/1/",
        type: "post",
        data: postdata,
        success: function(data){
            load_accounts();
            load_transactions(null, null, for_date);
        },
        error: function(error){
            alert(error.responseText);
        }
    });

}

function delete_account(account_id){
    $.ajax({
        url: "/accounts/"+account_id+"/",
        type: "delete",
        success: function(data){
            load_accounts();
        },
        error: function(error){
            alert(error.responseText);
        }
    });
}

function delete_transaction(transaction_id){
    $.ajax({
        url: "/transaction/"+transaction_id+"/",
        type: "delete",
        success: function(data){
            load_accounts();
            update_transactions_list();
        },
        error: function(error){
            alert(error.responseText);
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
            alert(error.responseText);
        }
    });
}
