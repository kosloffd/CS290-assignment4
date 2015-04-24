function makeRequest()
{
	var httpRequest;
	if(window.XMLHttpRequest)
	{
		httpRequest = new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{
		try
		{
			httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e)
		{
			try
			{
				httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e)	{}
		}
	}

	if(!httpRequest)
	{
		alert("Cannot create an HTML request");
	}
	
	httpRequest.onreadystatechange = displayGists;
	httpRequest.open("GET", createURL());
	httpRequest.send();

	function displayGists()
	{
		if(httpRequest.readyState === 4)
		{
			if(httpRequest.status === 200)
				{
					//alert("State: " + httpRequest.readyState + "\n" 
					//	 + "Status: " + httpRequest.status + "\nYou are connected.");
					//Call a function to parse 
					createList(parseGists(httpRequest.responseText))
				}
			else
			{
				alert(httpRequest.status + "\n -the connection could not be established");
			}
		}
	}
}

//Get info from page and append to URL
function createURL()
{
	//TODO: get info from HTML and append it.
	//For now, it's one result onone page.
	var pages = document.getElementsByTagName("input")[0];
	var pageValue = pages.data;
	var url = "https://api.github.com/gists?per_page=2&page=1";
	return url;
}

function parseGists(serverText)
{
	var gistArray = JSON.parse(serverText);
	console.log(gistArray.length);
	/*var gist = JSON.parse(serverText);
	for(element in gist)
	{
		gistArray.push(element);
		console.log(element);
	}*/
	return gistArray;
}

function createList(JSONarray)
{
	var body = document.getElementsByTagName("body")[0];
	var heading = document.createElement("h2");
	var newP = document.createElement("p");
	var newP2 = document.createElement("p");

	var resultText = document.createTextNode("Results:\n");
	var openDiv = document.createElement("div");
	openDiv.setAttribute("id", "gitList");
	var brk = document.createElement("br");

	body.appendChild(openDiv);
	heading.appendChild(resultText);
	body.appendChild(heading);

	for(var i=0; i < JSONarray.length; i++)
	{
		var gistText = document.createTextNode("URL: " + JSONarray[i].url);
		newP.appendChild(gistText);
		newP.appendChild(brk);
		gistText = document.createTextNode("Description: " + JSONarray[i].description)
		newP.appendChild(gistText);
		newP.appendChild(brk);
		gistText = document.createTextNode("ID: " + JSONarray[i].id);
		newP.appendChild(gistText);
		newP.appendChild(brk);
		//newP.appendChild(gistText);
		//body.appendChild(newP);		
		/*JSONarray[i].files.filename*/
		body.appendChild(newP);
	}
	var closeDiv = document.createElement("div");
	body.appendChild(closeDiv);
}



//Display favorites






[
{
	"url":"https://api.github.com/gists/daa4fbaedf6abe35aedd",
	"forks_url":"https://api.github.com/gists/daa4fbaedf6abe35aedd/forks",
	"commits_url":"https://api.github.com/gists/daa4fbaedf6abe35aedd/commits",
	"id":"daa4fbaedf6abe35aedd",
	"git_pull_url":"https://gist.github.com/daa4fbaedf6abe35aedd.git",
	"git_push_url":"https://gist.github.com/daa4fbaedf6abe35aedd.git",
	"html_url":"https://gist.github.com/daa4fbaedf6abe35aedd",
	"files":
		{
			"debug.txt":
			{
				"filename":"debug.txt",
				"type":"text/plain",
				"language":"Text",
				"raw_url":"https://gist.githubusercontent.com/anonymous/daa4fbaedf6abe35aedd/raw/52b0c9be2cc5f63bba66aaf7b53a3ef1292a1520/debug.txt",
				"size":48641
			}
		},
	"public":true,
	"created_at":"2015-04-24T03:42:41Z",
	"updated_at":"2015-04-24T03:42:41Z",
	"description":"YouTube Center 2.1.7-156 Debug Info",
	"comments":0,
	"user":null,
	"comments_url":"https://api.github.com/gists/daa4fbaedf6abe35aedd/comments"
	},
	{
		"url":"https://api.github.com/gists/2a90f27ebdb1f8c42de8",
		"forks_url":"https://api.github.com/gists/2a90f27ebdb1f8c42de8/forks",
		"commits_url":"https://api.github.com/gists/2a90f27ebdb1f8c42de8/commits",
		"id":"2a90f27ebdb1f8c42de8",
		"git_pull_url":"https://gist.github.com/2a90f27ebdb1f8c42de8.git",
		"git_push_url":"https://gist.github.com/2a90f27ebdb1f8c42de8.git",
		"html_url":"https://gist.github.com/2a90f27ebdb1f8c42de8",
		"files":
		{
			"untrusted-lvl9-solution.js":
			{
				"filename":"untrusted-lvl9-solution.js",
				"type":"application/javascript",
				"language":"JavaScript",
				"raw_url":"https://gist.githubusercontent.com/anonymous/2a90f27ebdb1f8c42de8/raw/78d6e0483bdee58a622fdb6e15a092c79a051c2a/untrusted-lvl9-solution.js","size":1439
			}
		},
		"public":true,
		"created_at":"2015-04-24T03:42:36Z",
		"updated_at":"2015-04-24T03:42:36Z",
		"description":"Solution to level 9 in Untrusted: http://alex.nisnevich.com/untrusted/",
		"comments":0,
		"user":null,
		"comments_url":"https://api.github.com/gists/2a90f27ebdb1f8c42de8/comments"
}
]