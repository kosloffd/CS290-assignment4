var page = [];
var currentPage = 0;
window.onload = displayFavList;
function makeRequest()
{
	var pageToBeFilled = page.length;
	var pageToReturn = page.length + 1;
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
		alert("Cannot create a request");
	}

	httpRequest.onreadystatechange = displayGists;
	httpRequest.open("GET", createURL(pageToReturn));
	httpRequest.send();

	function displayGists()
	{	
		if(httpRequest.readyState === 4)
		{
			if(httpRequest.status === 200)
			{	
				if(getPageCount() == null)
				{window.alert("You need to enter the number of pages to return.");}
				else if(getPageCount() < 0 || getPageCount() > 5)
				{window.alert("Sorry, I can only return 1-5 pages.");}
				
				if(!doneLoadingPages())	
				{
					page[pageToBeFilled] = parseGists(httpRequest.responseText);	//Add each request to the page array
					if(doneLoadingPages())
					{	
						createSearchResultList(page[currentPage]);
					}
					else
					{
						makeRequest();
					}
				}
			}
			else
			{
				alert(httpRequest.status + "\n -the connection could not be established");
			}
		}
	}
}

function doneLoadingPages()
{
	if(getPageCount() == null || getPageCount === -1)
	{return true;}

	else if(page.length < getPageCount())
	{
		return false;
	}
	else {return true;}
}

function getPageCount()
{
	var pageTotal;
	if(document.getElementsByTagName("input")[0].value === "")		//if the user hasn't entered a page qty
	{
		pageTotal = null;
		return pageTotal;
	}
	else
	{
		pageTotal = document.getElementsByTagName("input")[0].value;
		if(pageTotal < 0 || pageTotal > 5)
		{pageTotal = -1;}
		return pageTotal;
	}
}

//Get info from page and append to URL
function createURL(pageNumber)
{
	var url = "https://api.github.com/gists?per_page=30&page=" + pageNumber;
	return url;
}

function displayFavList()
{
	if(localStorage.key(0) !== null)												//If there ARE favorites...
	{
		if(document.getElementById("defaultText") !== null)		//if the default text is there
		{
			document.getElementById("defaultText").remove();			//remove the default text
		}			
		showListFromStorage();																//display the favorites
	}
}

function showListFromStorage()
{
	for(var i = 0; i <(localStorage.length); i++)
	{
		if(localStorage.getItem("id" + i) !==null)										//if that id key is in storage
		{
			var elementID = localStorage.getItem("id" + i);
			if(document.getElementById(elementID) === null)							//and if there is no element with that ID on the page		
			{
				//if(document.getElementById(elementID).parentElement.parentElement.id !== "favoritesList")		//and it's not already in the favorites list 
				//{																													
					var favDiv = document.getElementById("favoritesList");
					var favListBody = document.createElement("ul");
					favListBody.appendChild(makeRemoveButton(elementID));
					favListBody.appendChild(makeListItem("Description: ", localStorage.getItem("desc" + i)));
					favListBody.appendChild(makeListItem("File: ", localStorage.getItem("fileName" + i)));
					favListBody.appendChild(makeHrefItem("URL: ", localStorage.getItem("url" + i)));
					favListBody.appendChild(makeListItem("ID: ", localStorage.getItem("id" + i)));
					favDiv.appendChild(favListBody);
				//}
			}
		}
	}
}

function makeRemoveButton(id)
{
	var btn = document.createElement("button");
	btn.setAttribute("id", id);
	btn.setAttribute("onclick", "removeFromFavList(this.id)");
	btn.innerHTML = "-";
	return btn;
}

function removeFromFavList(id)
{
	for(var i = 0; i<localStorage.length; i++)						
	{
		if(localStorage.getItem("id" + i) === id && typeof page[0] !== "undefined")							//if the page[] isn't empty (happens on page reload)
		{	
			var locationArray = findById(id);
			var idPageNumber = locationArray[0];
			
			//If there is a list of gists displayed and the item to remove from favorites is originally from that page
			if((document.getElementById("gitList") !== null) && (currentPage == idPageNumber))		
			{
				var body = document.getElementsByTagName("body")[0];
				var gistDiv = document.getElementById("gitList");
				var listBody = document.createElement("ul");
			
				var lang = getLanguage(id);

				listBody.appendChild(makeFavButton(localStorage.getItem("id" + i)));
				listBody.appendChild(makeListItem("Description: ", localStorage.getItem("desc" + i)));
				listBody.appendChild(makeListItem("Language: ", lang));
				listBody.appendChild(makeHrefItem("URL: ", localStorage.getItem("url" + i)));
				listBody.appendChild(makeListItem("File: ", localStorage.getItem("fileName" + i)));
				gistDiv.appendChild(listBody);
				body.appendChild(gistDiv);																									
			}
		}

		if(localStorage.getItem("id" + i) === id)											//Added for when the page[] is empty because the page has been reloaded)
		{
			localStorage.removeItem("id" + i);													//Remove values from local storage
			localStorage.removeItem("desc" + i);
			localStorage.removeItem("url" + i);
			localStorage.removeItem("fileName" + i);
		}	
	}
	removeFromList(id);																								//refresh the favorites div
}

function parseGists(serverText)
{
	var gistArray = JSON.parse(serverText);
	return gistArray;
}

function createSearchResultList(JSONarray)
{
	if(document.getElementById("gitList") !== null)
		{
			var oldList = document.getElementById("gitList");
			oldList.remove();
		}
	
	var body = document.getElementsByTagName("body")[0];
	var heading = document.createElement("h2");
	var resultText = document.createTextNode("Results:\n");
	var gistDiv = document.createElement("div");
	gistDiv.setAttribute("id", "gitList");
	heading.appendChild(resultText);
	gistDiv.appendChild(heading);
	var buttonDiv = createPageButtons(getPageCount());
	gistDiv.appendChild(buttonDiv);

	for(var i=0; i < JSONarray.length; i++)
	{
		var listBody = document.createElement("ul");
		var desc = JSONarray[i].description;
		var url = JSONarray[i].url;
		var objectID = JSONarray[i].id;
		var fileName = getFileName(objectID);
		var lang = getLanguage(objectID);
		
		if(!checkIfFavorite(objectID))
		{
			listBody.appendChild(makeFavButton(objectID));
			listBody.appendChild(makeListItem("Description: ", desc));
			listBody.appendChild(makeListItem("Language: ", lang));
			listBody.appendChild(makeHrefItem("URL: ", url));
			listBody.appendChild(makeListItem("File: ", fileName));
			gistDiv.appendChild(listBody);
			body.appendChild(gistDiv);}
	}
}

function createPageButtons(num)
{
	btnDiv = document.createElement("div");
	btnDiv.setAttribute("id", "buttonDiv");
	btnLabel = document.createElement("label");
	btnLabel.innerHTML = "Pages: ";
	btnDiv.appendChild(btnLabel);
	for(var i=0; i<num; i++)
	{
		btn = document.createElement("button");
		btn.innerHTML = i+1;
		btn.setAttribute("id", i);
		btn.setAttribute("onclick", "changePage(this.id)");
		btnDiv.appendChild(btn);
	}
	return btnDiv;
} 

function changePage(number)
{
	if(number !== currentPage)
	{
		currentPage = number;
		createSearchResultList(page[currentPage]);
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

function getFileName(id)
{
	var locationArray = findById(id);
	var pageContent = page[locationArray[0]];
	var location = locationArray[1];
	var fileObject = pageContent[location].files;
	var tmpKeyArray = Object.keys(fileObject);
	var keyName = tmpKeyArray[0];
	var filename = fileObject[keyName].filename;
	return filename;
}

function getLanguage(id)
{
	
	var locationArray = findById(id);
	var pageContent = page[locationArray[0]];
	var location = locationArray[1];
	var fileObject = pageContent[location].files;
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
	//var location = findById(id);
	//var pageContent = page[currentPage];

				var locationArray = findById(id);
				var pageContent = page[locationArray[0]];
				var location = locationArray[1];

	var fileName = getFileName(id);
	var lang = getLanguage(id);
	
	var val = findOpenLocalStorageKey();
	localStorage.setItem("id" + val, id);
	localStorage.setItem("fileName" + val, fileName);
	localStorage.setItem("url" + val, pageContent[location].url);
	localStorage.setItem("desc" + val, pageContent[location].description);
	removeFromList(id);
	displayFavList();
}

function findById(id)
{
	var location = [];															//the location is a two variable item. [0] = page, [1] = item
	for(var i = 0; i < page.length; i++)
	{
		var pageContent = page[i]; 
		for(var j=0; j < pageContent.length; j++)						//iterate through objects in the current page
		{
			if(pageContent[j].id === id)											//check to find the object with this id param
			{
				location[0] = i;
				location[1] = j;
				return location;
			}
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



