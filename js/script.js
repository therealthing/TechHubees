$(document).ready(function() {
    $("#quote-button").click(function() {
        $.ajax({
            url: 'http://api.forismatic.com/api/1.0/',
            data: {
                method: 'getQuote',
                format: 'jsonp',
                lang: 'en'
            },
            jsonp: 'jsonp',
            jsonpCallback: 'getQuote',
            error: function() {
                console.log("An error has occurred");
            },
            dataType: 'jsonp',
            success: function(data) {
                $("h2").html(data.quoteText);

                $("#author").html(data.quoteAuthor);

                $("a").attr('href', 'https://twitter.com/intent/tweet'+"?text="+'"'+data.quoteText+'"'+" - "+data.quoteAuthor);
                console.log(data);
            },
            type: 'GET'
        });
    });
});/**
 * Created by Ponderatul on 26/09/2015.
 */
