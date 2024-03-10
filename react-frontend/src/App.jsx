import React from 'react';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/Nav.css';

import Header from './components/Header';
import Sidebar from './components/Sidebar';

import Agency from './pages/agency/Agency';
import Doctor from './pages/doctor/Doctor';
import Journal from './pages/journal/Journal';
import Patient from './pages/patient/Patient';
import Treatment from './pages/treatment/Treatment';

import NewAgency from './pages/agency/NewAgency';
import NewDoctor from './pages/doctor/NewDoctor';
import NewJournal from './pages/journal/NewJournal';
import NewPatient from './pages/patient/NewPatient';
import NewTreatment from './pages/treatment/NewTreatment';

import ProfitsReport from './pages/ProfitsReport';
import ErrorPage from './pages/templates/ErrorPage';

import Agencies from './pages/agency/Agencies';
import Doctors from './pages/doctor/Doctors';
import Journals from './pages/journal/Journals';
import Patients from './pages/patient/Patients';
import Treatments from './pages/treatment/Treatments';

function App() {
    return (
        <div className="container-fluid page-wrapper">
            <link rel="icon" href="favicon.png" type="image/x-icon" />
            <div className='row'>
                <Header />
            </div>
            <div className="row full-height">
                <div className="col-2 sidebar">
                    <Sidebar />
                </div>
                <div className="col content">
                    <Routes>
                        <Route path='/patient/:patientId' element={<Patient />} />
                        <Route path='/treatment/:treatmentId' element={<Treatment />} />
                        <Route path='/agency/:agencyId' element={<Agency />} />
                        <Route path='/doctor/:doctorId' element={<Doctor />} />
                        <Route path='/journal/:journalId' element={<Journal />} />

                        <Route path="/patients" element={<Patients />} />
                        <Route path="/treatments" element={<Treatments />} />
                        <Route path='/agencies' element={<Agencies />} />
                        <Route path='/doctors' element={<Doctors />} />
                        <Route path='/journals' element={<Journals />} />
                        <Route path='/' element={<Journals />} />

                        <Route path='/newPatient' element={<NewPatient />} />
                        <Route path='/newTreatment' element={<NewTreatment />} />
                        <Route path='/newAgency' element={<NewAgency />} />
                        <Route path='/newDoctor' element={<NewDoctor />} />
                        <Route path='/newJournal' element={<NewJournal />} />

                        <Route path='/report' element={<ProfitsReport />} />

                        <Route path='*' element={<ErrorPage />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default App;