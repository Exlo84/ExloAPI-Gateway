import React from 'react';

class SwaggerPage extends React.Component {
  render() {
    return (
      <div style={{ height: '100vh', width: '100%' }}>
        <iframe
          src={process.env.REACT_APP_SWAGGER_URL}
          title="Swagger UI"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        ></iframe>
      </div>
    );
  }
}

export default SwaggerPage;