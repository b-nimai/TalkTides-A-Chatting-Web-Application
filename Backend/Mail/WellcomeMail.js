const welcomeMail = (name) => {
	return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>Welcome to TalkTides</title>
		<style>
			body {
				background-color: #ffffff;
				font-family: Arial, sans-serif;
				font-size: 16px;
				line-height: 1.4;
				color: #333333;
				margin: 0;
				padding: 0;
			}
	
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				text-align: center;
			}
	
			.message {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 20px;
			}
	
			.body {
				font-size: 16px;
				margin-bottom: 20px;
				text-align: left;
			}
	
			.cta {
				display: inline-block;
				padding: 10px 20px;
				background-color: #FFD60A;
				color: #000000;
				text-decoration: none;
				border-radius: 5px;
				font-size: 16px;
				font-weight: bold;
				margin-top: 20px;
			}
	
			.support {
				font-size: 14px;
				color: #999999;
				margin-top: 20px;
			}
		</style>
	</head>
	
	<body>
		<div class="container">
			<div class="message">Welcome to TalkTides, ${name}!</div>
			<div class="body">
				<p>We’re excited to have you join TalkTides, the ultimate platform for seamless communication and connecting with others. Here’s how to get started:</p>

        		<h2>Getting Started</h2>
        		<ul>
        		    <li><strong>Set Up Your Profile:</strong>
        		        <ul>
        		            <li>Log in to your account.</li>
        		            <li>Upload a profile picture and update your bio.</li>
        		            <li>Personalize your chat settings.</li>
        		        </ul>
        		    </li>
        		    <li><strong>Start Chatting:</strong>
        		        <ul>
        		            <li>Find friends or join groups to start conversations.</li>
        		            <li>Send messages, emojis, and multimedia files easily.</li>
        		        </ul>
        		    </li>
        		    <li><strong>Stay Connected:</strong>
        		        <ul>
        		            <li>Receive instant notifications for new messages.</li>
        		            <li>Access your chats from any device, anytime.</li>
        		        </ul>
        		    </li>
        		</ul>

        		<h2>Features You’ll Love</h2>
        		<ul>
        		    <li><strong>Real-Time Messaging:</strong> Enjoy smooth, real-time conversations with friends and family.</li>
        		    <li><strong>Group Chats:</strong> Create or join group chats to keep in touch with multiple people at once.</li>
        		</ul>
			</div>
			<div>
				<p>Sincerely,</p>
				<p>The TalkTides Team</p>
			</div>
			<div class="support">
				<p>For any assistance, please feel free to reach out to us at 
				<a href="mailto:inquiriestides@gmail.com">inquiriestides@gmail.com</a>. We are here to help!</p>
				<p>Address: 1 Vidyasagar street, Kolkata, 700009</p>
			</div>
		</div>
	</body>
	
	</html>`;
};

module.exports = welcomeMail;
