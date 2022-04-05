/***************************
 *  LOADER IMPLEMENTATION  *
 ***************************/

/// Base Loader Implementation.
const loader = {

    /// IFRAME Loader.
    preloadIFrame: async (iframe) => new Promise(resolve =>
        iframe.element.onload = () => resolve()
    ),

    /// Code Loader.
    prepareCode: async (block) => {
        // retrieve the current text
        const text = block.prev().text().split(/\r?\n/).reduce((acc, line, ii) => {
            // get the current spaces on the left
            const left = line.length - line.trimLeft().length;

            // trim as necessary if left is less than current spaces
            if (left < acc.spaces && ii > 0 && line.length > 0) acc.spaces = left;

            // remove the front of the string
            acc.value += `${line.substr(acc.spaces)}\n`;

            // return the result
            return acc;
        }, { value: '', spaces: Infinity }).value.trim();

        // convert to suitable display
        const language = block.attr('data-language');
        const code = hljs.highlight(text, { language }).value;

        // construct and append each required item
        block.append(
            $.create('div', {
                className: 'title',
                children: [
                    $.create('span', { className: 'code mr-5', innerHTML: language }),
                    $.create('button', {
                        className: 'btn btn-sm btn-inverted',
                        innerHTML: '<i class="las la-lg la-copy"></i>&nbsp;Copy',
                        onclick: () => navigator.clipboard.writeText(text.value)
                    })]
            }),
            $.create('pre', {
                className: 'm-0',
                innerHTML: `<code class="ignore-style">${code}</code>`
            })
        );
    },

    /// Route Loader.
    updateRoute: async () => {
        const hash = encodeURIComponent(window.location.hash.substring(1));
        const title = hash.includes('%2F') ? hash.substr(hash.lastIndexOf('%2F') + 3) : hash;
        const content = await fetch(`docs/${hash}`, { method: 'GET' }).then((res) => res.text());

        // denote a reference to the content body
        const body = $('#content-body');

        // set the current title and content
        $('#content-title').text(title[0].toUpperCase() + title.substring(1));
        body.text(content);

        // once the body is has content, prepare any form validation
        Illuminate.Forms.prepare(body);

        // preload all the iframes as necessary
        await Promise.all($.all('iframe', body).map(loader.preloadIFrame));

        // once complete, load in any CODE to display
        $.all('.code-container', body).map((block) => loader.prepareCode(block));
    },

}

/*******************
 *  SCRIPT RUNNER  *
 *******************/

loader.updateRoute();
window.onhashchange = loader.updateRoute;