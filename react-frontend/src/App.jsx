import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'; 

import Header from './pages/Header';

import Patient from './pages/patient/Patient';
import Agency from './pages/agency/Agency';
import Treatment from './pages/treatment/Treatment';
import Doctor from './pages/doctor/Doctor';
import Journal from './pages/journal/Journal';

import NewPatient from './pages/patient/NewPatient';
import NewDoctor from './pages/doctor/NewDoctor'
import NewTreatment from './pages/treatment/NewTreatment';
import NewJournal from './pages/journal/NewJournal';
import NewAgency from './pages/agency/NewAgency';

import ProfitsReport from './pages/ProfitsReport';
import ErrorPage from './pages/ErrorPage';

import Patients from './pages/patient/Patients';
import Agencies from './pages/agency/Agencies';
import Treatments from './pages/treatment/Treatments';
import Doctors from './pages/doctor/Doctors';
import Journals from './pages/journal/Journals';

function App() {
    return (
        <div>
            <link rel="icon" href="favicon.png" type="image/x-icon"></link>
            <BrowserRouter>
                <Header />
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
                    <Route path='/newJournal' element={<NewJournal/>} />

                    <Route path='/report' element={<ProfitsReport />} />

                    <Route path='*' element={<ErrorPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;