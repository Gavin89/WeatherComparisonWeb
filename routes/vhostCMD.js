

var vhost = require('../models/calculations.js');

module.exports = function(app) {

  /**
   * Find and retrieves all vhosts
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  findAllvhosts = function(req, res) {
    console.log("GET - /vhosts");
    return vhost.find(function(err, vhosts) {
      if(!err) {
        return res.send(vhosts);
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  /**
   * Find and retrieves a single vhost by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  findById = function(req, res) {

    console.log("GET - /vhost/:id");
    return vhost.findById(req.params.id, function(err, vhost) {

      if(!vhost) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      if(!err) {
        return res.send({ status: 'OK', vhost:vhost });
      } else {

        res.statusCode = 500;
        console.log('Internal error(%d): %s', res.statusCode, err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  /**
   * Creates a new vhost from the data request
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  addvhost = function(req, res) {

    console.log('POST - /vhost');

    var vhostManager = new vhost({
      Site:    req.body.Site,
      Type:    req.body.Type,
      Project :    req.body.Project
    });

    vhostManager.save(function(err) {

      if(err) {

        console.log('Error while saving vhost: ' + err);
        res.send({ error:err });
        return;

      } else {

        console.log("vhost created");
        return res.send({ status: 'OK', vhost:vhost });

      }

    });

  };

  /**
   * Update a vhost by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  updatevhost = function(req, res) {

    console.log("PUT - /vhost/:id");
    return vhost.findById(req.params.id, function(err, vhost) {

      if(!vhost) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }  
	  
      if (req.body.Site != null) vhost.Site = req.body.Site;
      if (req.body.Type != null) vhost.Type = req.body.Type;
      if (req.body.Project != null) vhost.Project = req.body.Project;

      return vhost.save(function(err) {
        if(!err) {
          console.log('Updated');
          return res.send({ status: 'OK', vhost:vhost });
        } else {
          if(err.name == 'ValidationError') {
            res.statusCode = 400;
            res.send({ error: 'Validation error' });
          } else {
            res.statusCode = 500;
            res.send({ error: 'Server error' });
          }
          console.log('Internal error(%d): %s',res.statusCode,err.message);
        }

        res.send(vhost);

      });
    });
  };

  /**
   * Delete a vhost by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  deletevhost = function(req, res) {

    console.log("DELETE - /vhost/:id");
    return vhost.findById(req.params.id, function(err, vhost) {
      if(!vhost) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      return vhost.remove(function(err) {
        if(!err) {
          console.log('Removed vhost');
          return res.send({ status: 'OK' });
        } else {
          res.statusCode = 500;
          console.log('Internal error(%d): %s',res.statusCode,err.message);
          return res.send({ error: 'Server error' });
        }
      })
    });
  }

  //Link routes and actions
  app.get('/vhost', findAllvhosts);
  app.get('/vhost/:id', findById);
  app.post('/vhost', addvhost);
  app.put('/vhost/:id', updatevhost);
  app.delete('/vhost/:id', deletevhost);

}