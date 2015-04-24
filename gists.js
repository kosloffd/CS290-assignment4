function makeRequest(pages)
{
	var page = [];
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
	httpRequest.open("GET", createURL(pages));
	httpRequest.send();
	
	function displayGists()
	{	
		if(httpRequest.readyState === 4)
		{
			if(httpRequest.status === 200)
			{
				//---------------Look up array element.
				page.unshift(parseGists(httpRequest.responseText));	//Add each request to the page array
				myRecursion(page.length);															//If samller than wanted pages, add more
				console.log(page.length);
				console.log(page[1])															
				createList(page[0]);
				createPageButtons();																	//Display the first page only
			}
			else
			{
				alert(httpRequest.status + "\n -the connection could not be established");
			}
		}
	}
}

function getPageCount()
{
	var pageTotal = document.getElementsByTagName("input")[0];
	return pageTotal;
}

//Get info from page and append to URL
function createURL(pageNumber)
{
	var url = "https://api.github.com/gists?per_page=3&page=" + pageNumber;
	return url;
}

function createPageButtons()
{
	var pages = getPageCount();
	for(int i=1; i<=pages; i++)
	{
		var pgBtn = document.createElement("button");
		pgBtn.setAttribute("onclick", createList(this.page[i]));
		var btnName = document.createTextNode("Page" + (i));
		pgBtn.appendChild(btnName);
		body.appendChild(pgBtn);
	}
} 

function parseGists(serverText)
{
	var gistArray = JSON.parse(serverText);
	return gistArray;
}

function myRecursion(arrLength)
{
	var numPages = getPageCount();
	//Very distant recursive call to get other pages into this.page[]
	if(arrLength < numPages)
	{
		makeRequest(arrLength + 1);
	}
	else {return;}
}

function createList(JSONarray)
{
	var body = document.getElementsByTagName("body")[0];
	var heading = document.createElement("h2");
	var resultText = document.createTextNode("Results:\n");
	var gistDiv = document.createElement("div");
	gistDiv.setAttribute("id", "gitList");
	var listBody = document.createElement("ul");
	heading.appendChild(resultText);
	body.appendChild(heading);

	for(var i=0; i < JSONarray.length; i++)
	{
		listBody.appendChild(makeHrefItem("URL: ", JSONarray[i].url));
		listBody.appendChild(makeListItem("Description: ", JSONarray[i].description));
		listBody.appendChild(makeListItem("ID: ", JSONarray[i].id));
		listBody.appendChild(makeListItem("File: ", JSONarray[i].files.filename));
		gistDiv.appendChild(listBody);
		body.appendChild(gistDiv);
	}
}

function makeListItem(title, data)
{
	var line = document.createElement("li");
	var text = document.createTextNode(title + data);
	line.appendChild(text);
	return line;
}

function makeHrefItem(title, url)
{
	var link = document.createElement("a");
	var line = document.createElement("li");
  link.appendChild(document.createTextNode(url));
	link.setAttribute("href", url);
	var textLine = document.createTextNode(title);
	line.appendChild(textLine);
	line.appendChild(link);
	return line;
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