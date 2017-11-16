    SJTL (Simple Javascript Object Notation Template Language)

License of SJTL (Simple Javascript Object Notation Template Language) and 
License of SJTL engines written by William Spencer Ward III:

SJTL (Simple Javascript Object Notation Template Language) Copyright William 
Spencer Ward III and SJTL engine Copyright William Spencer Ward III
 
Redistribution and use in source and binary forms, with or without 
modification, are permitted provided that the following conditions are met:
 
1. Redistributions of source code must retain the above copyright notice, this 
list of conditions and the following disclaimer.
 
2. Redistributions in binary form must reproduce the above copyright notice, 
this list of conditions and the following disclaimer in the documentation 
and/or other materials provided with the distribution.
 
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE 
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL 
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR 
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER 
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, 
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE 
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.



    Overview of SJTL

SJTL is a template language that runs on the web browser and sources all 
dynamic data from a JSON string. Although SJTL could be used in a server 
environment as well, it was designed with client-side templating in mind.

SJTL helps to separate static content from dynamic content from the standpoint 
of the server, the cloud environment, and the network while making it easy to 
recombine these using the web browser itself. SJTL allows the web browser to 
cache all static content but can prevent the caching of all dynamic content.

An SJTL template is read from a div tag and is meant to contain HTML and static 
text with minimal javascript or CSS. Most javascript or CSS should be placed 
outside of SJTL templates. The '{' and '}' characters are reserved in SJTL and 
cannot appear within an SJTL template except when defining an SJTL tag.

The initial SJTL engine is written in javascript, although it could be 
re-written in almost any programming language.

It is important to note that SJTL running in a browser is meant to augment 
server-side code in some situations, and replace server-side code in other 
situations. For simpler webpages, SJTL client-side templating might completely 
replace server-side templating. On the other hand, it may be desirable to pick 
and choose which server-side code should be replaced with SJTL client-side 
templating and which should not be.


    Advantages of SJTL

SJTL was designed to be a very simple but powerful language. A simple template 
language requires only a simple, and therefore, small but fast HTML template 
engine. By the same token, a simple template language makes it easier to write 
smaller, more efficient template code and to write this code more quickly.

SJTL minimizes repetitiveness in HTML code through use of an iterating subset 
tag. When a template is processed, every member of an array or array subset 
will be rendered in the browser window in place of only one occurrence of a 
subset tag in the template code. Also, every element of the array will be 
surrounded by the specified HTML tags or other text, without having to specify 
these "decorators" more than once. By using two subset tags, one nested within 
the other, one can display an entire two-dimensional array formatted as an HTML 
table.

SJTL syntax is similar to the syntax used in other popular template languages. 
The "clauses" used for non-primitive data type tags in SJTL function similarly 
to the clauses in many popular programming languages. This makes it an easy to 
use template language for developers and designers that already have experience 
in other template and programming languages.


    Serverless Hosting Misnomer

In reality, there is no such thing as serverless hosting. All cloud 
environments run on server hardware with CPU's and RAM. These facts are 
important to bring up because in any hosting environment, fewer CPU cycles and 
bytes of RAM requested from the underlying server hardware result, ultimately, 
in economic savings for everyone, from the owners of the server and network 
hardware, to the owners of cloud entities and web sites.

For the purposes of this document, the concept of a "server" refers not only to 
traditional web servers, but to virtual servers and other cloud entities.


    Advantages of Client-Side HTML(Hyper Text Markup Language) Templating

Almost complete separation of static content from dynamic content, before it 
reaches the user's browser, can be achieved using client-side templating. This 
can result in simplified website development and more well defined professional 
responsibilities. Data specialists can concentrate on developing and 
maintaining a data source, while web page developers and designers can 
concentrate on creating and maintaining web pages.

The separation of static and dynamic content also curbs the amount of traffic 
caused by dynamic HTML pages that must be completely re-downloaded every time 
the browser returns to the same page, with the same HTML and javascript code, 
simply because the data changed. Additionally, the web browser can be made to 
never cache dynamic content. This avoids complications that arise when stale 
web pages still contain old data. 

When client-side templating is utilized, the CPU and RAM overhead of template 
processing is offloaded to the client, allowing for a more economical server or 
cloud entity to host a given website. Because all client platforms, including 
Windows and Macintosh PC's as well as Android and iOS devices, have become very 
powerful, they can and should handle CPU load that the server or cloud entity 
had to shoulder in the past.

Another advantage of using client-side templating is that it makes it easy to 
compress and encrypt all of a web page's dynamic content without spending 
resources doing this to static content. A website might use the HTTP protocol 
instead of the HTTPS protocol and achieve the same security benefits while 
utilizing less overhead.


    Note about Scraping

The term "scraping" generally refers to automatically obtaining massive amounts 
of data from a website using a bot. One might think that when a website serves 
data in JSON strings rather than in HTML files, a scraping bot may be easier to 
write. 

However, most unsecured websites are very easy to scrape no matter how the data 
is served. Many excellent parsing utilities and libraries are available to help 
target even the most difficult-to-scrape websites. The only defense against 
scraping that is likely to succeed is user account security. 

Also, it is important to consider that JSON strings can be encrypted by the 
server and decrypted by the web browser prior to being used in a client-side 
template engine. This encryption is a better barrier against scraping bots than 
encasing data in repetitive HTML tags.


    Input and Output for the SJTL Engine

The SJTL template must be enclosed within HTML "comment" markers inside of an 
HTML div section, or "input div". The input div is to contain only the comment 
markers and the template when the SJTL engine runs. The HTML output of the SJTL 
engine will be written to an "output div". The contents of the output div will 
be completely overwritten by the SJTL engine. The HTML 'id' property of the 
input div and output div are provided to the SJTL engine to indicate which div 
tags to use.

Although the input div may be used as the output div, it will no longer contain 
the template after the SJTL engine writes to it, unless the web page is 
reloaded. It is advisable to use different div sections for the output and 
input div. 

The output div should be in the same file as the code that initiates the SJTL 
engine. The input div may reside in a separate HTML file from the input div and 
engine initiation or within the same file. Note that if the input div is in a 
different file, the SJTL engine cannot be initiated until after the browser has 
completed loading the file containing the input div.


    Clauses and Tags used in SJTL Templates

In SJTL, all tags are either primitive tags, non-primitive tags, empty tags 
('{}'), or separator tags ('{-}'). All tags begin with '{' and end with '}'. A 
primitive tag references either a string or a number variable in the JSON 
string, but never a boolean variable. This is because boolean variables in the 
JSON string enable or disable rendering in the browser window, as explained 
later. A non-primitive tag may reference an array, an object, or a boolean 
variable in the JSON string.

A 'clause' is a statement in a template that begins with a non-primitive tag 
and ends with an empty tag. A clause contains text and/or tags that are 
processed as children of the opening tag of the clause. The opening tag of the 
clause dictates how the text and/or tags within the clause are processed. A 
clause begins with a tag that references a "parent array", a "parent object", 
or a "parent boolean value" within the JSON string. A clause is considered a 
"child clause" of the "parent tag" that opens it. A clause may be an "array 
clause", an "object clause", a "boolean clause", or an "inverse clause" 
depending on the type of parent tag that begins the clause.

Tags may contain the name of the equivalent variable, object, or array within 
the JSON string or a subset of a parent array. If a tag contains a name and is 
inside of a clause, then the name refers to a child of the parent object that 
begins the clause.

A subset tag begins with '{[' and ends with ']}' and references a subset of the 
parent array tag of the clause. A subset appended to a name in a tag may 
contain an integer, eg. '[3]', referring to a member of an array, a pair of 
integers separated by ':', eg. '[4:6]', indicating a range of members in an 
array, or an integer followed by ':N', eg. '[5:N]', indicating a range 
beginning with a specific integer index and ending with the highest indexed 
member of the array. Note that all integers inside a subset tag are positive 
and 0-indexed. The array members referenced by a subset may be strings, 
numbers, arrays, or objects, but never boolean values.

A clause that begins with an array tag must always contain a subset tag. If a 
subset tag represents an array or an object, then it must be an opening tag of 
a clause. If a subset tag represents an array, the child clause of the subset 
tag must contain another subset tag within it. A subset tag, like tags 
containing a JSON variable name, serves as a placeholder where array members 
will be rendered within text or HTML tags in the browser window. All text or 
HTML within an array clause will be rendered in the browser window 'n' times, 
where 'n' is he number of elements specified by a subset. This text and HTML 
will be positioned about the subset tag in the browser window as specified in 
the template.

Consider an array within a JSON string named "my_array". The template code 
"{my_array}<td>{[0:N]}</td>{}" renders every element of "my_array" in the 
browser window, each surrounded by the '<td>' and '</td>' elements. Next, 
consider an array of arrays named "my_dataset". The template code 
"<table>{my_dataset}<tr>{[0:N]}<td>{[0:N]}</td>{}</tr>{}</table>" renders the 
entire 2-dimensional data set within a table in the browser window.

The separator tag, indicated by '{-}', divides HTML and text between two 
successive SJTL tags when it is unclear which SJTL tag the HTML code or text is 
to be associated with. For example, if a portion of an SJTL template is 
originally written as "<td>{[0]}</td><td>{[0:N]}</td>", the SJTL engine cannot 
determine which HTML tags are associated with the first SJTL tag vs. the second 
SJTL tag. By adding a separator tag, eg. "<td>{[0]}</td>{-}<td>{[0:N]}</td>", 
the SJTL engine will know which of the HTML tags to print around each SJTL tag 
iteration. Otherwise, some HTML elements or text might appear the wrong number 
of times.

Boolean and inverse tags both reference a boolean member of the JSON string. 
Note that unnamed boolean values and boolean array members are not supported in 
SJTL. A boolean tag name matches the name of the corresponding JSON boolean 
value, while an inverse tag name begins with a '!' followed by the name of the 
corresponding JSON boolean value. Both of these tag types must begin a "boolean 
clause" or "inverse clause", respectively. The text, HTML, and tags within a 
boolean clause are rendered only if the corresponding JSON member value equals 
true, while the opposite is the case for the contents of an inverse clause. 

Note that the SJTL engine will fully process, but not display, the HTML 
contents of unrendered boolean and inverse clauses. This is because of the 
sequential nature of the SJTL engine, and the fact that it needs to continue 
parsing the complete template in order to keep track of text positions and 
opening and closing tags.

Because the boolean data type is used for enabling or disabling the display of 
HTML, it may be better to use string values in JSON to turn on and off boolean 
indicators. For example, the string values "checked" and "" could toggle the 
"checked" property of a checkbox, while "yes" and "no" could switch between 
"yes.gif" and "no.gif" images when used as boolean indicators.


    Usage Notes

    SJTL Engine Initial Release Usage
    
It is a good idea to review the test .html files provided with the SJTL engine. 
They help explain how SJTL works and how to use the SJTL engine.

The javascript code can be included in an HTML file using a tag such as the 
following: 

    "<script type='text/javascript' src='sjtl-1.0.0-min.js'></script>".

The engine is initialized and executed by instantiating the sjtl_engine "class" 
(function prototype), setting the member variables "s_template_divtag_id" and 
"s_render_divtag_id", and calling the run_sjtl member function with a JSON 
string as the only argument:

    var sjtl = new sjtl_engine;
    sjtl.s_template_divtag_id = "sjtl_template_000";
    sjtl.s_render_divtag_id = "sjtl_template_000";
    sjtl.run_sjtl(s_json);
    delete sjtl;


    SJTL Engine Initial Release Minifier Usage

Uglifier2 was to used create the minified javascript source file. The following 
command was used:

uglifyjs sjtl-1.0.0.js -o sjtl-1.0.0-min.js --compress --mangle --mangle-props

Following the usage of this command, the license header must be reinserted, and 
the function name "run_sjtl" and the member variable names 
"s_template_divtag_id" and "s_render_divtag_id" must all be unshortened in the 
minified file.
        
