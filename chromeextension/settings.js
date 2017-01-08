function save_options() {

	O = {};
	for(var i in bool_vars)
	  O[bool_vars[i]] = document.getElementById(bool_vars[i]).checked;
	for(var i in text_vars)
	  O[text_vars[i]] = document.getElementById(text_vars[i]).value;
	for(var i in int_vars)
	  O[int_vars[i]] = parseInt(document.getElementById(int_vars[i]).value);

  chrome.storage.sync.set(O, function() {

    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Khhhhzzzzzzz ... Roger ... Khhhzzzz';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get( all_vars, function(O) {
	  for(var i in bool_vars)
		  if(bool_vars[i] in O)
		  document.getElementById(bool_vars[i]).checked = O[bool_vars[i]];
	  for(var i in text_vars)
		  if(text_vars[i] in O)
		  document.getElementById(text_vars[i]).value = ""+O[text_vars[i]];
	  for(var i in int_vars)
		  if(int_vars[i] in O)
		  document.getElementById(int_vars[i]).value = ""+O[int_vars[i]];
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
