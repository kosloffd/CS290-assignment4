var page = [currentPage];
var currentPage = 0;
window.onLoad = displayFavList();
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
	httpRequest.open("GET", createURL(1));
	httpRequest.send();
	
	function displayGists()
	{	
		if(httpRequest.readyState === 4)
		{
			if(httpRequest.status === 200)
			{	
				displayFavList();
				var newVal = page.unshift(parseGists(httpRequest.responseText));	//Add each request to the page array
				createSearchResultList(page[0]);
				/*myRecursion(newVal);															//If samller than wanted pages, add more
				createPageButton();															
				*/
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

/*
function createPageButton(num)
{
	var pgBtn = document.createElement("button");
	pgBtn.setAttribute("onclick", "createList(this.page[num])");
	//var btnName = document.createTextNode("Page" + (num));
	pgBtn.innerHTML = "Page " + num;
	body.appendChild(pgBtn);
} 
*/

function displayFavList()
{
	if(localStorage.key(0) !== null)												//If there ARE favorites...
	{
		if(document.getElementById("defaultText") !== null)
		{
			document.getElementById("defaultText").remove();			//remove the default text
		}			
		showListFromStorage();																//display the favorites
	}
}

function showListFromStorage()
{
	for(var i = 0; i <(localStorage.length/4); i++)
	{
		//var favDiv = document.getElementById("favoritesList");
		var favListBody = document.createElement("ul");
		favListBody.appendChild(makeRemoveButton(localStorage.getItem("id" + i)));
		favListBody.appendChild(makeListItem("Description: ", localStorage.getItem("desc" + i)));
		favListBody.appendChild(makeListItem("File: ", localStorage.getItem("fileName" + i)));
		favListBody.appendChild(makeHrefItem("URL: ", localStorage.getItem("url" + i)));
		favListBody.appendChild(makeListItem("ID: ", localStorage.getItem("id" + i)));
		if(document.getElementById("favoritesList") !== null)
		{
			document.getElementById("favoritesList").appendChild(favListBody);
		}
	}
}

function makeRemoveButton(id)
{
	var btn = document.createElement("button");
	btn.setAttribute("id", id);
	btn.setAttribute("onclick", "removeFromFavList(id)");
	btn.innerHTML = "-";
	return btn;
}

function removeFromFavList(id)
{
	removeFromList(id);
	if(document.getElementById("gitList") !== null)		//If there is a list displayed
	{
		for(var i = 0; i<localStorage.length/4; i++)						
		{
			if(localStorage.getItem("id" + i) === id)							// add to gitList from localStorage
			{	
				var body = document.getElementsByTagName("body")[0];
				var gistDiv = document.getElementById("gitList");
				var listBody = document.createElement("ul");
				var lang = getLanguage(page[currentPage][i].files);

				listBody.appendChild(makeFavButton(localStorage.getItem("id" + i)));
				listBody.appendChild(makeListItem("Description: ", localStorage.getItem("desc" + i)));
				listBody.appendChild(makeListItem("Language: ", lang));
				listBody.appendChild(makeHrefItem("URL: ", localStorage.getItem("url" + i)));
				listBody.appendChild(makeListItem("File: ", localStorage.getItem("fileName" + i)));
				gistDiv.appendChild(listBody);
				body.appendChild(gistDiv);																									
				
				localStorage.removeItem("id" + i);													//Remove values from local storage
				localStorage.removeItem("desc" + i);
				localStorage.removeItem("url" + i);
				localStorage.removeItem("fileName" + i);
			}
		}	
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

function createSearchResultList(JSONarray)
{
	var body = document.getElementsByTagName("body")[0];
	var heading = document.createElement("h2");
	var resultText = document.createTextNode("Results:\n");
	var gistDiv = document.createElement("div");
	gistDiv.setAttribute("id", "gitList");
	heading.appendChild(resultText);
	body.appendChild(heading);

	for(var i=0; i < JSONarray.length; i++)
	{

		var listBody = document.createElement("ul");
		var fileObject = JSONarray[i].files;
		var fileName = getFileName(fileObject);
		var lang = getLanguage(fileObject);
		var desc = JSONarray[i].description;
		var url = JSONarray[i].url;
		
		if(!checkIfFavorite(JSONarray[i].id))
		{
			listBody.appendChild(makeFavButton(JSONarray[i].id));
			listBody.appendChild(makeListItem("Description: ", desc));
			listBody.appendChild(makeListItem("Language: ", lang));
			listBody.appendChild(makeHrefItem("URL: ", url));
			listBody.appendChild(makeListItem("File: ", fileName));
			gistDiv.appendChild(listBody);
			body.appendChild(gistDiv);
		}
	}
}

function checkIfFavorite(gistID)
{
	var idRE = /id/;
	for(var i = 0; i<localStorage.length; i++)
	{
		if(idRE.test(localStorage.key(i))) //only check the local storage keys starting with "id"
		{
			if(localStorage.getItem(localStorage.key(i)) === gistID) //if the key's value matches gistID param
			{return true;}
		}	
		else 
			{return false;}
	}
}

function getFileName(fileObject)
{
	var tmpKeyArray = Object.keys(fileObject);
	var keyName = tmpKeyArray[0];
	var filename = fileObject[keyName].filename;
	return filename;
}

function getLanguage(fileObject)
{
	var tmpKeyArray = Object.keys(fileObject);
	var keyName = tmpKeyArray[0];
	var language = fileObject[keyName].language;
	return language;
}

function makeFavButton(id)
{
	var favBtn = document.createElement("button");
	favBtn.setAttribute("id", id);
	favBtn.setAttribute("onclick", "addToFavorites(id)");
	favBtn.innerHTML ="Add to Favorites";
	return favBtn;
}

function removeFromList(id)
{
	document.getElementById(id).parentElement.remove();
}

function addToFavorites(id)
{
	var pageContent = page[currentPage];
	var location = findById(id);
	
	var fileObject = pageContent[location].files;
	var fileName = getFileName(fileObject);
	var lang = getLanguage(fileObject);
	
	var val = findOpenLocalStorageKey();
	localStorage.setItem("id" + val, pageContent[location].id);
	localStorage.setItem("fileName" + val, fileName);
	localStorage.setItem("url" + val, pageContent[location].url);
	localStorage.setItem("desc" + val, pageContent[location].description);
	removeFromList(id);
	//need a way to refresh the list hereand change the showListFromStorage() or
	// displayFavList() to show ONLY the files in local storage	--right now if I add more
	//than one, it shows some duplicates.
}

function findById(id)
{
	var location;
	var pageContent = page[currentPage]; 
	for(var i=0; i < pageContent.length; i++)						//iterate through objects in the current page
	{
		if(pageContent[i].id === id)											//check to find the object with this id param
		{
			location = i;
			return location;
		}
	}
}

function findOpenLocalStorageKey()
{
	var keyValue;
	for(var i = 0; i<=localStorage.length; i++)			//check to see which value is available to 
	{																									//use as a local storage key
		if(localStorage.getItem("id" + i) === null)	
		{	
			keyValue = i;
			return keyValue;
		}
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



/*

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

keyValue = 0;																	
localStorage.setItem("id" + keyValue, "12345");
localStorage.setItem("fileName" + keyValue, "Diapers");
localStorage.setItem("url" + keyValue, "http://www.google.org");
localStorage.setItem("desc" + keyValue, "test");




*/