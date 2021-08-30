const { set } = require('mongoose');
const Home = require('../models/Home');
const Item = require('../models/Item');
const Image = require('../models/Image');

// ===========   Dashboard   ========= //
const viewDashboard = (req, res) => {
  try {
    res.render('admin/dashboard/view_dashboard', {
      title: 'Wisata | dashboard',
    });
  } catch (error) {
    console.log(error);
  }
};

// ===========   Home Page   ========= //
// show
const viewHome = async (req, res) => {
  try {
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = {
      message: alertMessage,
      status: alertStatus,
    };

    const homes = await Home.find();

    res.render('admin/home/view_home', {
      title: 'Wisata | Home',
      homes,
      alert,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/admin/home');
  }
};
// add
const addHome = async (req, res) => {
  try {
    let { title, desc, active } = req.body;
    // if add to active then make the other to be non active
    if (active) {
      await Home.updateOne(
        { isActive: true },
        {
          $set: {
            isActive: false,
          },
        }
      );
    } else {
      // if home empty
      const home = await Home.find();
      active = home.length == 0 ? true : false;
    }
    await Home.create({ title, desc, isActive: active ? true : false });
    req.flash('alertMessage', 'Success add Home Page');
    req.flash('alertStatus', 'success');
    res.redirect('/admin/home');
  } catch (error) {
    req.flash('alertMessage', 'Failed add Home Page');
    req.flash('alertStatus', 'danger');
    res.redirect('/admin/home');
  }
};
// edit
const editHome = async (req, res) => {
  try {
    let { id, title, desc, active } = req.body;
    // if edit to active then make the other to be non active
    if (active) {
      await Home.updateOne(
        { isActive: true },
        {
          $set: {
            isActive: false,
          },
        }
      );
    } else {
      const home = await Home.findOne({ isActive: true });
      if (home._id == id) {
        active = true;
      }
    }

    await Home.updateOne(
      { _id: id },
      {
        $set: {
          title: title,
          desc: desc,
          isActive: active ? true : false,
        },
      }
    );
    req.flash('alertMessage', 'Success edit Home Page');
    req.flash('alertStatus', 'success');
    res.redirect('/admin/home');
  } catch (error) {
    req.flash('alertMessage', 'Failed edit Home Page');
    req.flash('alertStatus', 'danger');
    res.redirect('/admin/home');
  }
};
// delete
const deleteHome = async (req, res) => {
  try {
    const { id } = req.params;
    const home = await Home.findOne({ isActive: true });
    if (home._id == id) {
      await Home.updateOne(
        { isActive: false },
        {
          $set: {
            isActive: true,
          },
        }
      );
    }
    await Home.deleteOne({ _id: id });

    req.flash('alertMessage', 'Success delete Home Page');
    req.flash('alertStatus', 'success');
    res.redirect('/admin/home');
  } catch (error) {
    console.log(error);
    req.flash('alertMessage', 'Failed delete Home Page');
    req.flash('alertStatus', 'danger');
    res.redirect('/admin/home');
  }
};

// ===========   Item Page   ========= //
// show
const viewItems = async (req, res) => {
  try {
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = {
      message: alertMessage,
      status: alertStatus,
    };

    const items = await Item.find();

    res.render('admin/items/view_items', {
      title: 'Wisata | items',
      alert,
      items,
    });
  } catch (error) {
    console.log(error);
  }
};
// add
const addItems = async (req, res) => {
  try {
    const { name, desc, location } = req.body;
    const item = await Item.create({ name, desc, location });
    req.files.forEach(async (file) => {
      const image = await Image.create({ imageUrl: `images/${file.filename}` });
      item.imageId.push({ _id: image._id });
      await item.save;
    });
    req.flash('alertMessage', 'Success add Item');
    req.flash('alertStatus', 'success');
    res.redirect('/admin/items');
  } catch (error) {
    console.log(error);
    req.flash('alertMessage', 'Failed add Item');
    req.flash('alertStatus', 'danger');
    res.redirect('/admin/items');
  }
};
// detail
const viewDetailItems = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id });
    res.render('admin/items/detail_item', {
      title: 'Wisata | detail - items',
      item,
    });
  } catch (error) {
    console.log(error);
  }
};

// ========  Feature Page  ======== //
// show
const viewFeature = (req, res) => {
  try {
    res.render('admin/feature/view_feature', {
      title: 'Wisata | feature',
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  viewDashboard,
  viewHome,
  addHome,
  editHome,
  deleteHome,
  viewItems,
  addItems,
  viewDetailItems,
  viewFeature,
};
