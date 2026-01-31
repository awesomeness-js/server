import ui from '#ui';

app.pages.wisdom.init = (data) => {

	if(data){

		app.pages.wisdom.data = data; 

	} 

	ui.cleanMain();

	if(data.tag){

		app.pages.wisdom.tag(data.tag);
		
		return;
	
	}


	const $introContainer = $(`<div class="grid center p30"></div>`).appendTo(app.$main);
	const $intro = $(`<div class="max-width-800"></div>`).appendTo($introContainer);

	const $title = $(`<h1 class="mtb50 text-center mb10">I know <em>some</em> stuff...</h1>`).appendTo($intro);
	const $subtitle = $(`<p class="text-xl ptb20">
			... but, I'm not <b><u>the</u> expert</b> on anything;
			I try to cite people smarter than me whenever possible. 
			I have a degree in Aeronautical 
	</p>`).appendTo($intro);

	const $readMore = $(`<a class="link">... read more</a>`).appendTo($subtitle).click(()=>{

		$readMore.remove();

		$(`<span>
			Science with Minors in Business and Law and MBA with a specialization in Finance,
			but honestly most of what I know I've learned from experience,
			making dumb mistakes, asking questions and learning from people 
			<a class="link text-600" href="/shout-outs">smarter than me</a>.
			<br/><br/>
			Being a pilot for example — 
			I'm a certified flight instructor and used to fly private jets — 
			you don't need a degree to fly a plane,
			but you do need to learn a lot of stuff to do it safely.
			But legally, and in all reality, you learn from other pilots (instructors)
			who may or may not have any degree and straight up just know how to fly.
			<br/><br/>
			One thing I learned after spending $230,0000 on my education is that
			<a class="link" href="/do-I-need-college">you don't need a degree</a> to be "successful" or become an expert in something.
			<br/><br/>
			Most of the things I know, 
			I can point your to 
			<a class="link" href="/shout-outs">YouTube videos</a>, 
			<a class="link" href="/shout-outs">podcasts</a> and 
			<a class="link" href="/library">books</a>
			that will teach better than your would-be professor.
			<em>Most "good" professors have their own YouTube channels or podcasts anyway</em>.
			<br/><br/>
			I hope this site eventually becomes a resource like that.
			<br/><br/>
			I'm not 100% anti-college, but I'm 100% have an specific goal,
			like networking, or becoming a Rocket Scientist, or Doctor, etc.
			in mind before spending a penny.
			<br/><br/>
			All that said, <b>I've learned a few things</b> over the years that I think are worth sharing.
			Most of what I write about are things people ask me about frequently, 
			things I wish I knew when I was starting out,
			or <b>important lessons I want my kids to know</b> when they grow up.
			<br/><br/>
		</span>`).appendTo($subtitle);

	
	});

	

	const $categories = $('<div class="mt50 plr35"></div>').appendTo(app.$main);
	const $catHeader = $('<h2 class="mb15">Browse by Popular Topics</h2>').appendTo($categories);

	const $catList = $('<div class=""></div>').appendTo($categories);

	const tagsWithImages = [ ... data.tags ].filter((tag) =>{

		return tag.image ?? false;

	});

	tagsWithImages.push({
		name: "All Posts",
		image: "/tools/images/tags/all.webp",
		count: data.posts.length
	});

	tagsWithImages.sort((a, b) => b.count - a.count);

	console.log(tagsWithImages);

	// floating-box
	const $carousel = ui.carousel({
		items: tagsWithImages,
		print: (item, index) => {

			const $topic = $(`<div class="blog-topic cursor-pointer"></div>`);
						
			const $image = $(`<div class="blog-topic-image"></div>`)
				.appendTo($topic)
				.css({
					'background-image': `url(${item.image})`
				});

			const $words = $(`<div class="p20"></div>`).appendTo($topic);

			const $title = $(`<div class="text-500 text-m text-natural-700"><span>${item.name}</span></div>`).appendTo($words);
			const $count = $(`<span class="text-300 text-s text-natural-400 ml10">(${item.count})</span>`).appendTo($title);

			$topic.click(() => {

				if(item.name === 'All Posts'){

					$list.trigger('search', '');
					
				} else {

					$list.trigger('search', 'category: ' + item.name);

				}

			
			});

			return $topic;

		}
	}).appendTo($catList);


	// post 1
	const $mainPostContainer = $(`<div class="ptb50 max-width-1200 width100 justify-self-center"></div>`).appendTo(app.$main);


	ui.posts.preview2(data.posts[0]).click((e)=>{

		e.preventDefault();
		e.stopPropagation();

		app.page(data.posts[0].url);
			
	}).appendTo($mainPostContainer);


	const $top = $(`<div class="p40"></div>`).appendTo(app.$main);

	const $categoryCloud = ui.categoryCloud({
		data: data.tags,
		limit: 20,
		search: data.tags.length > 20,
		colorMap: app.pages.wisdom.colors,
		callback: (name) => {

			$list.trigger('search', 'category: ' + name);
        
		}
	}).appendTo($top);



	const $mainPosts = $('<div class="plr20-p plr40 max-width-1200 width100 justify-self-center"></div>').appendTo(app.$main);
			

	
	ui.posts.preLoadImages(data.posts);	


	const $list = ui.list({
		data: data.posts,
		autoLoad: true,
		listClass: 'grid-1 gap-25 gap-50-d gap-100-xl',
		searchInputClass: 'text-xl',
		placeholder: 'Search posts by title, subtitle, or tag...',
		animationStyle: 'rotateIn',
		searchCallback: (val) => {

			// scroll to $list
			$list[0].scrollIntoView({ behavior: 'smooth' });

		},
		searchFn: ({
			item: post, 
			val 
		}) => {


			if(!val){

				return true; 

			}


			const v = String((val ?? '')).toLowerCase().trim();

			const isCategory = v.startsWith('category: ');

			if(isCategory){

				const categorySearch = v.slice(9).trim(); // remove 'category: '

				const winner = !!categorySearch
				&& Array.isArray(post.tags)
				&& post.tags.some((tag) => String(tag).toLowerCase().trim().includes(categorySearch));

				return winner;

			}

			return (
				post.title.toLowerCase().includes(v) ||
				(post.subtitle && post.subtitle.toLowerCase().includes(v)) ||
				post.tags.some((tag) => String(tag).toLowerCase().trim().includes(v))
			);
		
		},
		printFn: (post) => {

			return ui.posts.preview2(post).click((e) => {

				e.preventDefault();
				e.stopPropagation();

				app.page(post.url);
			
			});
		
		},
		limit: 3
	}).appendTo($mainPosts).addClass('pt80');
			



};
